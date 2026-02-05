import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

beforeAll(async () => {
  const testDbPath = path.join(__dirname, "..", "prisma", "test.db");

  const dbFiles = [
    testDbPath,
    `${testDbPath}-journal`,
    `${testDbPath}-wal`,
    `${testDbPath}-shm`,
  ];
  for (const file of dbFiles) {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
      } catch (error) {}
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
  process.env.DATABASE_URL = `file:${testDbPath}`;

  try {
    execSync(
      `node node_modules/prisma/build/index.js migrate deploy --schema=${schemaPath}`,
      {
        cwd: path.join(__dirname, ".."),
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: `file:${testDbPath}` },
      }
    );
  } catch (error) {
    console.error("Failed to run migrations on test database:", error);
    throw error;
  }
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
});
