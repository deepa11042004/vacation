import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Peltown Travel CRM API',
        version: '1.0.0',
      },
      tags: [
        { name: 'Authentication', description: 'Login, logout, token refresh' },
        { name: 'Users', description: 'Panel staff accounts (Admin / Manager / Agent)' },
        { name: 'Staff', description: 'Staff (field agents) — separate auth and profile management' },
        { name: 'Clients', description: 'Client master profiles' },
        { name: 'Memberships', description: 'Membership contracts — tracks nights, balance, and status' },
        { name: 'Payments', description: 'Payment records against memberships' },
        { name: 'Invoices', description: 'Invoice generation and email delivery' },
        { name: 'Hotels', description: 'Hotel / property listings with images' },
        { name: 'Locations', description: 'Destination locations (domestic & international)' },
        { name: 'Settings', description: 'Application settings — email templates, company info' },
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
