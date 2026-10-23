import { allocateNextNumber, peekNextNumber } from './app-settings.service';

const invoiceExists = async (invoice_no: string) => {
  const { Invoice } = await import('@/modules/invoices/models/Invoice.model');
  return !!(await Invoice.findOne({ where: { invoice_no }, paranoid: false }));
};

const membershipExists = async (membership_number: string) => {
  const { Membership } = await import('@/modules/memberships/models/Membership.model');
  return !!(await Membership.findOne({ where: { membership_number } }));
};

export const nextInvoiceNumber = () => allocateNextNumber('invoice', invoiceExists);
export const previewInvoiceNumber = () => peekNextNumber('invoice', invoiceExists);

/** `packagePrefix` (e.g. GOL) is only used when no fixed membership prefix is configured. */
export const nextMembershipNumber = (packagePrefix: string) =>
  allocateNextNumber('membership', membershipExists, `${packagePrefix}-`);
export const previewMembershipNumber = (packagePrefix: string) =>
  peekNextNumber('membership', membershipExists, `${packagePrefix}-`);
