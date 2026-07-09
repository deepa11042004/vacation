import { NextRequest } from 'next/server';
import { InvoiceController } from '@/modules/invoices/controllers/invoice.controller';

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return InvoiceController.permanentDelete(request, id);
}
