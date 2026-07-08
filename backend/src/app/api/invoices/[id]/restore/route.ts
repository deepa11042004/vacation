import { NextRequest } from 'next/server';
import { InvoiceController } from '@/modules/invoices/controllers/invoice.controller';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return InvoiceController.restore(request, id);
}
