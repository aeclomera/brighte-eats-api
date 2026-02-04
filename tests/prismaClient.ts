import { PrismaClient } from '@prisma/client';

export function createTestPrisma() {
  return new PrismaClient({
    datasources: {
      db: {
        url: 'file:./test.db'
      }
    }
  });
}
