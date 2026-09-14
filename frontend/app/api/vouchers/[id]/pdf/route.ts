import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Voucher ID is required' }, { status: 400 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const authHeader = request.headers.get('authorization') || '';

    const backendRes = await fetch(`${apiUrl}/api/vouchers/${encodeURIComponent(id)}/pdf`, {
      headers: authHeader ? { Authorization: authHeader } : {},
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: `Voucher PDF not found (${backendRes.status})` },
        { status: backendRes.status }
      );
    }

    const blob = await backendRes.arrayBuffer();
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set(
      'Content-Disposition',
      backendRes.headers.get('Content-Disposition') || `attachment; filename="Holiday-Gift-Voucher-${id}.pdf"`
    );
    headers.set('Content-Length', String(blob.byteLength));

    return new NextResponse(new Uint8Array(blob), {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Error in frontend voucher ID download route:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to download voucher PDF' },
      { status: 500 }
    );
  }
}
