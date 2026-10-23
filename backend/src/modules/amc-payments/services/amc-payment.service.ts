import { AmcPaymentRepository } from '../repositories/amc-payment.repository';
import { AmcPayment } from '../models/AmcPayment.model';

export interface UpsertAmcPaymentInput {
  membership_id: number;
  year_number: number;
  amount?: number | null;
  is_received: boolean;
  is_waived_off?: boolean;
  payment_date?: string | null;
  payment_mode?: string | null;
}

const repo = new AmcPaymentRepository();

// A year is either received, waived off, or pending; waiving wins over a stray received flag.
const resolveState = (input: UpsertAmcPaymentInput) => {
  const is_waived_off = !!input.is_waived_off;
  const is_received = is_waived_off ? false : input.is_received;
  return { is_waived_off, is_received };
};

export class AmcPaymentService {
  async getByClientId(client_id: number): Promise<AmcPayment[]> {
    return repo.findByClientId(client_id);
  }

  async upsert(client_id: number, input: UpsertAmcPaymentInput): Promise<AmcPayment> {
    const { is_waived_off, is_received } = resolveState(input);
    const existing = await repo.findByClientAndYear(client_id, input.year_number);
    if (existing) {
      await repo.update(existing.amc_payment_id, {
        amount:       input.amount ?? existing.amount,
        is_received,
        is_waived_off,
        payment_date: is_received ? (input.payment_date ?? null) : null,
        payment_mode: is_received ? (input.payment_mode ?? null) : null,
      });
      return (await repo.findByClientAndYear(client_id, input.year_number))!;
    }
    return repo.create({
      client_id,
      membership_id: input.membership_id,
      year_number:   input.year_number,
      amount:        input.amount ?? null,
      is_received,
      is_waived_off,
      payment_date:  is_received ? (input.payment_date ?? null) : null,
      payment_mode:  is_received ? (input.payment_mode ?? null) : null,
    });
  }
}
