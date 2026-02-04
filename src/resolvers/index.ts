import { ServiceType, Service } from '@prisma/client';
import { Context, RegisterLeadInput } from '../types';

export const resolvers = {
  Query: {
    leads: async (_: unknown, __: unknown, { prisma }: Context) => {
      const leads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          services: {
            include: { service: true }
          }
        }
      });

      return leads.map((lead) => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        mobile: lead.mobile,
        postcode: lead.postcode,
        createdAt: lead.createdAt.toISOString(),
        services: lead.services.map((ls) => ls.service.name)
      }));
    },
    lead: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
        const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
            services: {
                include: { service: true }
            }
        }
        });

        if (!lead) {
            throw new Error(`Lead with ID ${id} not found`);
        }

        return {
            id: lead.id,
            name: lead.name,
            email: lead.email,
            mobile: lead.mobile,
            postcode: lead.postcode,
            createdAt: lead.createdAt.toISOString(),
            services: lead.services.map((ls) => ls.service.name)
        };
    }
  },
  Mutation: {
    register: async (
      _: unknown,
      { input }: { input: RegisterLeadInput },
      { prisma }: Context
    ) => {
      const { name, email, mobile, postcode, services } = input;

      if (!services || services.length === 0) {
        throw new Error('At least one service must be selected');
      }

      const serviceRecords = await prisma.service.findMany({
        where: {
          name: { in: services as ServiceType[] }
        }
      });

      if (serviceRecords.length !== services.length) {
        throw new Error('Invalid service selected');
      }

      const lead = await prisma.lead.create({
        data: {
          name,
          email,
          mobile,
          postcode,
          services: {
            create: serviceRecords.map((service: Service) => ({
              service: {
                connect: { id: service.id }
              }
            }))
          }
        },
        include: {
          services: {
            include: { service: true }
          }
        }
      });

      return {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        mobile: lead.mobile,
        postcode: lead.postcode,
        createdAt: lead.createdAt.toISOString(),
        services: lead.services.map((ls: { service: { name: ServiceType } }) => ls.service.name)
      };
    }
  }
};
