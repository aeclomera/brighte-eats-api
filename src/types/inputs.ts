import { ServiceType } from '@prisma/client';

export interface RegisterLeadInput {
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: ServiceType[];
}

