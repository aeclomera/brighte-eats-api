import gql from 'graphql-tag';

export const typeDefs = gql`
  enum ServiceType {
    DELIVERY
    PICKUP
    PAYMENT
  }

  type Lead {
    id: ID!
    name: String!
    email: String!
    mobile: String!
    postcode: String!
    services: [ServiceType!]!
    createdAt: String!
  }

  input RegisterLeadInput {
    name: String!
    email: String!
    mobile: String!
    postcode: String!
    services: [ServiceType!]!
  }

  type Query {
    leads: [Lead!]!
    lead(id: ID!): Lead
  }

  type Mutation {
    register(input: RegisterLeadInput!): Lead!
  }
`;
