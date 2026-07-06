import { NextRequest } from 'next/server';
import { InvoiceController } from '@/modules/invoices/controllers/invoice.controller';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return InvoiceController.getAll(request);
}
