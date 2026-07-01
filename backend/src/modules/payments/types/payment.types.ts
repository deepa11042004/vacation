export enum PaymentType {
  DOWN_PAYMENT = 'DOWN_PAYMENT',
  INSTALMENT = 'INSTALMENT',
  AMC = 'AMC',
  PENALTY = 'PENALTY',
  REFUND = 'REFUND',
}

export enum PaymentMode {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  ONLINE = 'ONLINE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export type PaymentFilterOptions = {
  membership_id?: number;
  client_id?: number;
  payment_type?: PaymentType;
  status?: PaymentStatus;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
};
