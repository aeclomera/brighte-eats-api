import { PrismaClient, ServiceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  for (const service of Object.values(ServiceType)) {
    await prisma.service.upsert({
      where: { name: service },
      update: {},
      create: { name: service }
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
