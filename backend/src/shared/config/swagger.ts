import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Peltown Travel CRM API',
        version: '1.0.0',
        description: `
## Peltown — Holiday Membership / Timeshare CRM

Admin-driven CRM backend for selling and managing holiday memberships.

### Authentication
All protected endpoints require a **Bearer JWT** in the \`Authorization\` header:
\`\`\`
Authorization: Bearer <accessToken>
\`\`\`
Access tokens expire in **15 minutes**. Use \`POST /api/auth/refresh\` to rotate.

### Roles
| Role | Access Level |
|------|-------------|
| ADMIN | Full access — all CRUD, cancellations, deletions |
| MANAGER | Create/update clients, memberships, payments, leads |
| AGENT | Read clients, manage own leads, log activities |
| CLIENT | Read-only on own profile, memberships, payments |

### Modules
- **Auth** — Login, logout, token refresh, current user
- **Users** — Internal staff accounts (Admin/Manager/Agent) + auto-created Client portal accounts
- **Clients** — Master client profiles with auto \`CLI-XXXXXX\` codes
- **Packages** — Holiday membership products under SILVER / GOLD / PLATINUM categories
- **Memberships** — Contract when a client buys a package; tracks nights, balance, status
- **Payments** — Manual payment records against a membership (no EMI auto-schedule)
        `,
      },
      tags: [
        { name: 'Authentication', description: 'Login, logout, token refresh' },
        { name: 'Users', description: 'Internal staff user accounts' },
        { name: 'Clients', description: 'Client master profiles' },
        { name: 'Packages', description: 'Holiday membership products (SILVER / GOLD / PLATINUM)' },
        { name: 'Memberships', description: 'Membership contracts — links client to package' },
        { name: 'Payments', description: 'Payment records against memberships' },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter the access token returned by POST /api/auth/login',
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
