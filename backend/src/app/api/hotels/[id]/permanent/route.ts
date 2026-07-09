import { NextRequest } from 'next/server';
import { HotelController } from '@/modules/hotels/controllers/hotel.controller';

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return HotelController.permanentDelete(request, id);
}
