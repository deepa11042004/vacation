import { NextRequest } from 'next/server';
import { ClientController } from '@/modules/clients/controllers/client.controller';

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return ClientController.permanentDelete(request, id);
}
