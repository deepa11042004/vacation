import { NextRequest } from 'next/server';
import { LocationController } from '@/modules/locations/controllers/location.controller';

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return LocationController.permanentDelete(request, id);
}
