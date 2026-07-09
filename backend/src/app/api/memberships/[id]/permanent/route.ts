import { NextRequest } from 'next/server';
import { MembershipController } from '@/modules/memberships/controllers/membership.controller';

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return MembershipController.permanentDelete(request, id);
}
