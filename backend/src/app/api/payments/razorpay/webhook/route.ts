import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { RazorpayService } from '@/shared/utils/razorpay.service';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ success: false, message: 'Missing webhook signature' }, { status: 400 });
    }

    const isValid = RazorpayService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('[Razorpay Webhook Warning]: Invalid webhook signature');
      return NextResponse.json({ success: false, message: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    console.log(`[Razorpay Webhook Event]: ${event.event}`, event.payload);

    await connectDB();

    // Handle specific razorpay events
    switch (event.event) {
      case 'payment.captured': {
        const paymentEntity = event.payload.payment.entity;
        console.log(`[Razorpay Payment Captured]: ID ${paymentEntity.id}, Amount: ${paymentEntity.amount / 100}`);
        // Can perform redundant validation or status log if needed
        break;
      }
      case 'payment.failed': {
        const paymentEntity = event.payload.payment.entity;
        console.warn(`[Razorpay Payment Failed]: ID ${paymentEntity.id}, Reason: ${paymentEntity.error_description}`);
        break;
      }
      default:
        console.log(`[Razorpay Webhook]: Unhandled event ${event.event}`);
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error: any) {
    console.error('[Razorpay Webhook Error]:', error);
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}
