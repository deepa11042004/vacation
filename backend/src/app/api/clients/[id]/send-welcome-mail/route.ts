import { NextRequest } from 'next/server';
import { ClientController } from '../../../../../modules/clients/controllers/client.controller';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return ClientController.sendWelcomeMail(req, params.id);
}
