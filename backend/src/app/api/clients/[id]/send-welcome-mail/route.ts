import { NextRequest } from 'next/server';
import { ClientController } from '../../../../../modules/clients/controllers/client.controller';

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return ClientController.sendWelcomeMail(req, id);
}
