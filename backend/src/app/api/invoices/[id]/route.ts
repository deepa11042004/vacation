import { NextRequest } from 'next/server';
import { InvoiceController } from '@/modules/invoices/controllers/invoice.controller';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return InvoiceController.getById(request, id);
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return InvoiceController.delete(request, id);
}
