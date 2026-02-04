import { PrismaClient, ServiceType } from '@prisma/client';
import { resolvers } from '../src/resolvers';

let prisma: PrismaClient;

beforeAll(async () => {
  prisma = new PrismaClient({
    datasources: { db: { url: 'file:./test.db' } }
  });
  await prisma.$connect();

  // Seed services
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

describe('leads and lead queries', () => {
  beforeEach(async () => {
    // Create some test leads
    await resolvers.Mutation.register(
      null,
      {
        input: {
          name: 'John Doe',
          email: 'john@test.com',
          mobile: '095400000000',
          postcode: '4026',
          services: [ServiceType.DELIVERY, ServiceType.PAYMENT]
        }
      },
      { prisma }
    );

    await resolvers.Mutation.register(
      null,
      {
        input: {
          name: 'Jane Doe',
          email: 'jane@test.com',
          mobile: '095400111222',
          postcode: '4026',
          services: [ServiceType.PICKUP]
        }
      },
      { prisma }
    );
  });

  it('returns all leads with their services', async () => {
    const leads = await resolvers.Query.leads(null, null, { prisma });

    expect(leads.length).toBe(2);

    const john = leads.find((l: any) => l.name === 'John Doe');
    expect(john).toBeDefined();
    expect(john!.services).toEqual(expect.arrayContaining(['DELIVERY', 'PAYMENT']));

    const jane = leads.find((l: any) => l.name === 'Jane Doe');
    expect(jane).toBeDefined();
    expect(jane!.services).toEqual(['PICKUP']);
  });

  it('returns a single lead by ID', async () => {
    const allLeads = await resolvers.Query.leads(null, null, { prisma });
    const leadId = allLeads[0].id;

    const lead = await resolvers.Query.lead(null, { id: leadId }, { prisma });

    expect(lead).toBeDefined();
    expect(lead.id).toBe(leadId);
    expect(lead.services.length).toBeGreaterThan(0);
  });

  it('throws error if lead not found', async () => {
    await expect(
      resolvers.Query.lead(null, { id: 'non-existent-id' }, { prisma })
    ).rejects.toThrow(/not found/);
  });
});
