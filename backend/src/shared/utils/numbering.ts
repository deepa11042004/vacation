import { allocateNextNumber, peekNextNumber } from './app-settings.service';
import { AppError } from '../middlewares/error.middleware';

const invoiceExists = async (invoice_no: string) => {
  const { Invoice } = await import('@/modules/invoices/models/Invoice.model');
  return !!(await Invoice.findOne({ where: { invoice_no }, paranoid: false }));
};

const membershipExists = async (membership_number: string) => {
  const { Membership } = await import('@/modules/memberships/models/Membership.model');
  return !!(await Membership.findOne({ where: { membership_number } }));
};

export const isMembershipNumberTaken = membershipExists;

const MEMBERSHIP_NUMBER_RE = /^[A-Za-z0-9\-_\/]+$/;

/**
 * Membership number for a new membership: the admin-entered one if given (must be unused),
 * otherwise the next free number in the configured series.
 */
export async function resolveMembershipNumber(requested: string | null | undefined, packagePrefix: string): Promise<string> {
  const custom = requested?.trim();
  if (!custom) return nextMembershipNumber(packagePrefix);
  if (custom.length > 30 || !MEMBERSHIP_NUMBER_RE.test(custom)) {
    throw new AppError('Membership number may only contain letters, numbers, - _ / (max 30 characters)', 400);
  }
  if (await membershipExists(custom)) {
    throw new AppError(`Membership number ${custom} is already in use`, 409);
  }
  return custom;
}

export const nextInvoiceNumber = () => allocateNextNumber('invoice', invoiceExists);
export const previewInvoiceNumber = () => peekNextNumber('invoice', invoiceExists);

/** `packagePrefix` (e.g. GOL) is only used when no fixed membership prefix is configured. */
export const nextMembershipNumber = (packagePrefix: string) =>
  allocateNextNumber('membership', membershipExists, `${packagePrefix}-`);
export const previewMembershipNumber = (packagePrefix: string) =>
  peekNextNumber('membership', membershipExists, `${packagePrefix}-`);
