import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { ResponseUtil } from '@/shared/utils/response.util';
import { RazorpayService } from '@/shared/utils/razorpay.service';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { amount, currency = 'INR', membership_id, client_id, payment_type, amc_payment_id, notes = {} } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        ResponseUtil.failure('Invalid or missing payment amount'),
        { status: 400 }
      );
    }

    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const orderMetadata = {
      ...notes,
      membership_id: membership_id ? String(membership_id) : '',
      client_id: client_id ? String(client_id) : '',
      payment_type: payment_type || 'ONLINE',
      amc_payment_id: amc_payment_id ? String(amc_payment_id) : '',
    };

    const order = await RazorpayService.createOrder(amount, receipt, orderMetadata, currency);

    return NextResponse.json(
      ResponseUtil.success('Razorpay order created successfully', {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
        receipt: order.receipt,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Razorpay Create Order Error]:', error);
    return NextResponse.json(
      ResponseUtil.failure(error?.message || 'Failed to create Razorpay order'),
      { status: 500 }
    );
  }
}
