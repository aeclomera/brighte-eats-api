import { PrismaClient, ServiceType } from '@prisma/client';
import { resolvers } from '../src/resolvers';
import * as path from 'path';

let prisma: PrismaClient;

beforeAll(async () => {
  const testDbPath = path.join(__dirname, '..', 'prisma', 'test.db');
  prisma = new PrismaClient({
    datasources: { db: { url: `file:${testDbPath}` } }
  });
  await prisma.$connect();

  for (const service of Object.values(ServiceType)) {
    await prisma.service.upsert({
      where: { name: service },
      update: {},
      create: { name: service }
    });
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  await prisma.leadService.deleteMany();
  await prisma.lead.deleteMany();
});

describe('register mutation', () => {
  it('creates a lead with selected services', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@test.com',
      mobile: '095400000000',
      postcode: '4026',
      services: [ServiceType.DELIVERY, ServiceType.PAYMENT]
    };

    const lead = await resolvers.Mutation.register(
      null,
      { input },
      { prisma }
    );

    expect(lead.id).toBeDefined();
    expect(lead.name).toBe('John Doe');
    expect(lead.services).toEqual(expect.arrayContaining(['DELIVERY', 'PAYMENT']));

    const dbLead = await prisma.lead.findUnique({
      where: { id: lead.id },
      include: { services: { include: { service: true } } }
    });

    expect(dbLead).not.toBeNull();
    expect(dbLead?.services.length).toBe(2);
  });

  it('throws error if no services provided', async () => {
    const input = {
      name: 'Jane Doe',
      email: 'jane.doe@test.com',
      mobile: '0905555555',
      postcode: '4026',
      services: []
    };

    await expect(
      resolvers.Mutation.register(null, { input }, { prisma })
    ).rejects.toThrow('At least one service must be selected');
  });

  it('throws error if invalid service provided', async () => {
    const input = {
      name: 'Alice',
      email: 'alice@test.com',
      mobile: '0400222333',
      postcode: '4026',
      services: ['INVALID_SERVICE'] as unknown as ServiceType[]
    };

    await expect(
      resolvers.Mutation.register(null, { input }, { prisma })
    ).rejects.toThrow('Invalid value for argument');
  });
});
