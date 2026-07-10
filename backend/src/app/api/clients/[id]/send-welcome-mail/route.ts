import { NextRequest } from 'next/server';
import { ClientController } from '../../../../../modules/clients/controllers/client.controller';

/**
 * @swagger
 * /api/clients/{id}/send-welcome-mail:
 *   post:
 *     summary: Send welcome email to client
 *     description: Sends a welcome onboarding email to the client's registered email address. Admin / Manager only.
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Welcome email sent successfully
 *       404:
 *         description: Client not found
 */
export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return ClientController.sendWelcomeMail(req, id);
}
