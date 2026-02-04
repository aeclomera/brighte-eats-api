# Brighte Eats – Expressions of Interest API

This repository contains a take-home exercise for the **Senior Backend Engineer** role at Brighte.

The goal of the project is to provide a backend system for collecting and viewing customer expressions of interest for a new product called **Brighte Eats**. Customers can register their interest in one or more services, and internal users can view those leads via a GraphQL API.

---

## Problem Overview

Brighte Eats offers the following services:

- Delivery
- Pick-up
- Payment

The system allows customers to submit their details and select which services they are interested in. These expressions of interest (leads) can then be queried through a dashboard or other client.

---

## Features

- GraphQL API written in **TypeScript**
- Runs on **Node.js**
- Uses a **relational database**
- Single mutation to register customer interest
- Queries to fetch all leads or a single lead
- Unit tests for core logic
- Easy local setup and execution

---

## Tech Stack

- **Node.js**
- **TypeScript**
- **GraphQL**
- **Relational Database** (e.g. PostgreSQL / SQLite)
- **ORM** (e.g. Prisma / TypeORM / Sequelize)
- **Jest** for unit testing

> The architecture prioritises clarity, correctness, and ease of iteration during the interview.

---

## API Design

### Mutation

#### `register`
Registers a new expression of interest.

**Arguments:**
- `name` (string)
- `email` (string)
- `mobile` (string)
- `postcode` (string)
- `services` (array of enum values: DELIVERY, PICK_UP, PAYMENT)

---

### Queries

#### `leads`
Returns all registered leads.

#### `lead`
Returns a single lead by ID.

---

## Data Model (High Level)

A lead contains:
- Name
- Email
- Mobile number
- Postcode
- Selected services
- Created timestamp

Services are stored in a structured way to support future expansion.

---

## Testing

- Unit tests cover:
  - Business logic
  - Validation
  - Core GraphQL resolvers
- Tests are written using **Jest**
- Can be run locally with:

```bash
npm test
