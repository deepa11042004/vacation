import { NextRequest } from 'next/server';
import { MembershipController } from '@/modules/memberships/controllers/membership.controller';

/**
 * @swagger
 * /api/clients/{id}/referrals:
 *   get:
 *     summary: Get referrals made by a client
 *     description: |
 *       Returns the memberships created with this client's membership(s) set as the referrer,
 *       plus a derived referral points total.
 *       - **CLIENT** role may only fetch their own referrals (`client_id` must match `token.client_id`)
 *     tags: [Memberships]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client referrals retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — CLIENT attempting to view another client's referrals
 */
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return MembershipController.getReferralsByClientId(request, params.id);
}
