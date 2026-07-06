export interface IInvoice {
  invoice_id: number;
  invoice_no: string;
  invoice_type: 'invoice' | 'tax';
  client_id: number;
  client_name: string;
  card_number: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  client_gst: string | null;
  payment_mode: string;
  payment_type: string;
  transaction_id: string;
  bank: string;
  card_cheque_no: string;
  amount: string;
  description: string;
  issue_date: string;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
