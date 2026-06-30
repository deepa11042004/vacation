# Travel CRM - Backend API

This is the independent backend API for the Time-Share / Holiday Membership Travel CRM. It is built using **Next.js 15 (App Router)** as the API framework, **MySQL 8** for the database, and **Sequelize / sequelize-typescript** as the ORM.

## Architecture Philosophy
- **Modular Design**: Features are separated into distinct modules (`clients`, `memberships`, `bookings`, etc.).
- **Repository Pattern**: Strict separation of concerns. Controllers handle requests, Services handle business logic, and Repositories handle database interactions.
- **No Automated Business Decisions**: Employees perform most operations manually. The CRM acts as a central record-keeping and workflow management tool.
- **Soft Deletes**: Data is never hard-deleted.

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MySQL (v8+) running locally or remotely

### 2. Environment Variables
Create a `.env` file in the root of the `backend` directory based on the following template:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=travel_crm

# Application
NODE_ENV=development
PORT=3001
```

*(Ensure the database `travel_crm` exists in your MySQL instance).*

### 3. Installation
Install all required dependencies:
```bash
npm install --legacy-peer-deps
```

---

## Database Migrations

Sequelize CLI is configured to run database migrations directly from the `src/database/migrations` directory.

To run all pending migrations and build the tables:
```bash
npx sequelize-cli db:migrate
```

*(To undo the last migration: `npx sequelize-cli db:migrate:undo`)*

---

## Running the Application

### Development
To run the server with hot-reloading on port 3001:
```bash
npm run dev
```

### Production
To compile and run the optimized production server on port 3001:
```bash
npm run build
npm start
```

---

## API Documentation (Swagger)

The project includes auto-generated interactive OpenAPI (Swagger) documentation. 

Once the server is running (`npm run dev` or `npm start`), visit:
**[http://localhost:3001/api-docs](http://localhost:3001/api-docs)**

This interface allows you to view all endpoints, expected request payloads, and even execute test requests directly against the API.

---

## Project Structure

```
backend/
├── src/
│   ├── app/
│   │   ├── api/                  # Next.js Route Handlers (API Endpoints)
│   │   │   └── clients/          # e.g., /api/clients endpoints
│   │   ├── api-docs/             # Swagger UI Render Page
│   │   └── layout.tsx            # Required Next.js Root Layout
│   ├── database/
│   │   ├── config.json           # Sequelize CLI Database Config
│   │   └── migrations/           # Raw Sequelize Migration files
│   ├── modules/                  # Isolated Feature Modules
│   │   └── clients/
│   │       ├── constants/        # Error messages, defaults
│   │       ├── controllers/      # Request orchestration (No business logic)
│   │       ├── dto/              # Data Transfer Objects (Interfaces)
│   │       ├── interfaces/       # Entity base interfaces
│   │       ├── models/           # Sequelize-Typescript Models
│   │       ├── repositories/     # DB queries (Find, Create, Update, Delete)
│   │       ├── services/         # Core business logic (Hashing, Constraints)
│   │       ├── types/            # Enums, custom types
│   │       └── validators/       # Zod validation schemas
│   └── shared/                   # Shared utilities and configuration
│       ├── config/               # e.g., Swagger Config
│       ├── database/             # Sequelize Singleton Connection
│       ├── middlewares/          # Centralized error handler, auth middleware
│       └── utils/                # Standardized API Response formatter
├── .env                          # Environment variables
├── .sequelizerc                  # Sequelize CLI Path Configuration
├── next.config.mjs               # Next.js Configuration
├── package.json                  # Dependencies & Scripts
└── tsconfig.json                 # TypeScript Config (Decorators enabled)
```
