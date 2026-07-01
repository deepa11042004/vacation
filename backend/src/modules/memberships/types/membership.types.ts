export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMode {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  ONLINE = 'ONLINE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD',
}

export enum MembershipDSA {
  VENUE = 'VENUE',
  CSDO = 'CSDO',
  OTHER = 'OTHER',
}

export type MembershipFilterOptions = {
  search?: string;
  client_id?: number;
  package_id?: number;
  status?: MembershipStatus;
  page?: number;
  limit?: number;
};
