import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ voucherNumber: string }> }
) {
  try {
    const { voucherNumber } = await params;
    if (!voucherNumber) {
      return NextResponse.json({ success: false, message: 'Voucher number is required' }, { status: 400 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const backendRes = await fetch(`${apiUrl}/api/vouchers/download/${encodeURIComponent(voucherNumber)}`);

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: `Voucher PDF not found or error generating PDF (${backendRes.status})` },
        { status: backendRes.status }
      );
    }

    const blob = await backendRes.arrayBuffer();
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set(
      'Content-Disposition',
      backendRes.headers.get('Content-Disposition') || `attachment; filename="Holiday-Gift-Voucher-${voucherNumber}.pdf"`
    );
    headers.set('Content-Length', String(blob.byteLength));

    return new NextResponse(new Uint8Array(blob), {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Error in frontend voucher download proxy route:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to download voucher PDF' },
      { status: 500 }
    );
  }
}
