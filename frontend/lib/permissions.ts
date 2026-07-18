interface SectionDef {
  key: string;
  label: string;
  href: string;
  adminOnly?: boolean;
}

export const SECTIONS: SectionDef[] = [
  { key: 'dashboard',        label: 'Dashboard',           href: '/admin/dashboard' },

  { key: 'clients',          label: 'All Clients', href: '/admin/clients' },
  { key: 'create_invoice',   label: 'Create New Invoice',  href: '/admin/create-invoice' },
  { key: 'invoices',         label: 'All Invoices',        href: '/admin/invoices' },

  { key: 'hotels',           label: 'Hotels',              href: '/admin/hotels' },
  { key: 'locations',        label: 'Locations',           href: '/admin/locations' },
  { key: 'email_template',   label: 'Email Template',      href: '/admin/settings/email-template' },
  { key: 'panel_users',      label: 'Panel Users',         href: '/admin/settings/panel-users', adminOnly: true },
  { key: 'staff',            label: 'Staff',               href: '/admin/staff' },
  { key: 'travel_queries',  label: 'Travel Queries',      href: '/admin/travel-queries' },
];

// More-specific prefixes must come before less-specific ones
const ROUTE_MAP: { prefix: string; section: string }[] = [
  { prefix: '/admin/settings/panel-users/create', section: 'panel_users' },
  { prefix: '/admin/settings/panel-users',        section: 'panel_users' },
  { prefix: '/admin/settings/email-template', section: 'email_template' },
  { prefix: '/admin/clients/new',             section: 'clients' },
  { prefix: '/admin/clients',                 section: 'clients' },
  { prefix: '/admin/create-invoice',          section: 'create_invoice' },
  { prefix: '/admin/invoices',                section: 'invoices' },

  { prefix: '/admin/hotels',                  section: 'hotels' },
  { prefix: '/admin/locations',               section: 'locations' },
  { prefix: '/admin/dashboard',               section: 'dashboard' },
  { prefix: '/admin/staff',                   section: 'staff' },
  { prefix: '/admin/travel-queries',         section: 'travel_queries' },
];

export function getRouteSection(pathname: string): string | null {
  for (const { prefix, section } of ROUTE_MAP) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return section;
    }
  }
  return null;
}

export interface PermissionUser {
  role: string;
  allowed_sections?: string[] | null;
}

export function hasAccess(user: PermissionUser | null, section: string): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  if (section === 'panel_users') return false;
  if (!user.allowed_sections || user.allowed_sections.length === 0) return false;
  return user.allowed_sections.includes(section);
}

