import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

beforeAll(() => {
  const testDbPath = path.join(__dirname, '..', 'prisma', 'test.db');
  
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
  
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  process.env.DATABASE_URL = `file:${testDbPath}`;
  
  try {
    execSync(`node node_modules/prisma/build/index.js migrate deploy --schema=${schemaPath}`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: `file:${testDbPath}` }
    });
  } catch (error) {
    console.error('Failed to run migrations on test database:', error);
    throw error;
  }
});

