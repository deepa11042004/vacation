import { NextResponse } from 'next/server';
import { getApiDocs } from '@/shared/config/swagger';

export async function GET() {
  const spec = getApiDocs();
  return NextResponse.json(spec);
}
