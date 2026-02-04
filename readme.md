# Brighte Eats Leads API

A GraphQL API to register and view expressions of interest for **Brighte Eats** services.
Built with **Node.js, TypeScript, Apollo Server, and Prisma** using a relational SQLite database.

---

## Features

- **Register leads** with name, email, mobile, postcode, and selected services (`DELIVERY`, `PICKUP`, `PAYMENT`)
- **Query all leads** or a single lead by ID
- Fully **unit tested** with Jest
- Clean relational data model using **Prisma ORM**

---

## Tech Stack

- Node.js + TypeScript
- Apollo Server (GraphQL)
- Prisma ORM
- SQLite (dev/test)
- Jest (unit tests)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd brighte-eats-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:

```bash
DATABASE_URL="file:./dev.db"
```

### 4. Setup database

Prisma is used for migrations and seeding.

```bash
# Run migrations
npx prisma migrate dev

# Seed initial services (DELIVERY, PICKUP, PAYMENT)
npx ts-node prisma/seed.ts
```

> This creates a SQLite database `dev.db` in the `prisma/` folder with the `Service` table pre-populated.

---

### 5. Run the server

```bash
npm run dev
```

The server will start on [http://localhost:4000](http://localhost:4000). Open this URL in your browser to access the Apollo Sandbox GraphQL playground.

---

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript (output in `dist/`)
- `npm start` - Run production server from built files
- `npm test` - Run Jest tests
- `npm run prisma` - Access Prisma CLI commands

---

## GraphQL Schema

### Enum

```graphql
enum ServiceType {
  DELIVERY
  PICKUP
  PAYMENT
}
```

### Lead Type

```graphql
type Lead {
  id: ID!
  name: String!
  email: String!
  mobile: String!
  postcode: String!
  services: [ServiceType!]!
  createdAt: String!
}
```

---

### Queries

**Get all leads**

```graphql
query {
  leads {
    id
    name
    email
    services
    createdAt
  }
}
```

**Get lead by ID**

```graphql
query {
  lead(id: "paste-lead-id-here") {
    id
    name
    email
    mobile
    postcode
    services
    createdAt
  }
}
```

---

### Mutation

**Register a new lead**

```graphql
mutation {
  register(
    input: {
      name: "Jane Doe"
      email: "jane@example.com"
      mobile: "0400000000"
      postcode: "2000"
      services: [DELIVERY, PAYMENT]
    }
  ) {
    id
    name
    email
    services
    createdAt
  }
}
```

---

## Running Tests

```bash
npm test
```

**Test Coverage:**
- ✅ `register` mutation with valid inputs
- ✅ `register` mutation with invalid inputs (missing services, invalid service types)
- ✅ `leads` query (returns all leads with services)
- ✅ `lead(id)` query (returns single lead by ID)

**Test Setup:**
- Uses a separate SQLite test database (`test.db`) to prevent affecting development data
- Database is reset before each test suite
- Tests run in isolation with Jest

---

## Project Structure

```
src/
  index.ts           # Apollo Server bootstrap
  schema.ts          # GraphQL schema (type definitions)
  resolvers/
    index.ts         # Queries and Mutations
  types/
    context.ts       # GraphQL context type
    index.ts         # Type exports
    inputs.ts        # Input type definitions
prisma/
  schema.prisma      # Database schema
  seed.ts            # Initial data seeding
  migrations/        # Database migration files
  dev.db             # Development SQLite database
  test.db            # Test SQLite database
tests/
  register.test.ts   # Unit tests for register mutation
  queries.test.ts    # Unit tests for leads and lead(id) queries
  prismaClient.ts    # Prisma client setup for tests
  setup.ts           # Jest test setup
jest.config.js       # Jest configuration
tsconfig.json        # TypeScript configuration
package.json         # Dependencies and scripts
.env                 # Environment variables (DATABASE_URL)
```

### Database Models

The Prisma schema defines three models:

- **Lead** - Stores lead information (id, name, email, mobile, postcode, createdAt)
- **Service** - Stores available services (id, name as ServiceType enum)
- **LeadService** - Join table connecting leads to services (many-to-many relationship)

---

## Design Choices

- **Apollo Server**: Standalone GraphQL server for clarity and simplicity
- **TypeScript**: Full type safety across the application
- **Prisma ORM**: Type-safe database access with automatic migrations
- **Relational model**: `Lead` and `Service` are normalized with a join table `LeadService` for many-to-many relationships
- **Validation**: Ensures at least one service is selected and all services exist before creating a lead
- **Separate test database**: Uses `test.db` to isolate test data from development data
- **Unit tests**: Comprehensive test coverage for all queries and mutations
- **Extensible**: Adding new services or queries requires minimal changes

