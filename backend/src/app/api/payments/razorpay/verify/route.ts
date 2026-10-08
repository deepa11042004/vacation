import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { ResponseUtil } from '@/shared/utils/response.util';
import { RazorpayService } from '@/shared/utils/razorpay.service';
import { PaymentService } from '@/modules/payments/services/payment.service';
import { PaymentMode, PaymentStatus, PaymentType } from '@/modules/payments/types/payment.types';
import { AmcPayment } from '@/modules/amc-payments/models/AmcPayment.model';

const paymentService = new PaymentService();

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      membership_id,
      client_id,
      amc_payment_id,
      payment_type = PaymentType.DOWN_PAYMENT,
      amount,
      remarks,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        ResponseUtil.failure('Missing required Razorpay payment verification fields'),
        { status: 400 }
      );
    }

    // 1. Verify HMAC SHA256 Signature
    const isValidSignature = RazorpayService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      return NextResponse.json(
        ResponseUtil.failure('Invalid Razorpay signature. Payment verification failed.'),
        { status: 400 }
      );
    }

    let recordedPayment = null;
    let updatedAmcRecord = null;

    // 2. Handle AMC Payment Update if applicable
    if (amc_payment_id) {
      const amcRec = await AmcPayment.findByPk(amc_payment_id);
      if (amcRec) {
        await amcRec.update({
          is_received: true,
          amount: amount || amcRec.amount,
          payment_date: new Date().toISOString().split('T')[0],
          payment_mode: 'ONLINE',
        });
        updatedAmcRecord = amcRec.toJSON();
      }
    }

    // 3. Record Payment in Payments Table if membership_id & client_id are supplied
    if (membership_id && client_id && amount) {
      const validPaymentType = Object.values(PaymentType).includes(payment_type)
        ? payment_type
        : PaymentType.INSTALMENT;

      recordedPayment = await paymentService.createPayment({
        membership_id: Number(membership_id),
        client_id: Number(client_id),
        payment_type: validPaymentType,
        amount: Number(amount),
        payment_date: new Date(),
        payment_mode: PaymentMode.ONLINE,
        transaction_ref: razorpay_payment_id,
        status: PaymentStatus.PAID,
        remarks: remarks || `Razorpay Online Payment (Order: ${razorpay_order_id})`,
      });
    }


    return NextResponse.json(
      ResponseUtil.success('Payment verified successfully', {
        verified: true,
        razorpay_order_id,
        razorpay_payment_id,
        payment: recordedPayment,
        amc_payment: updatedAmcRecord,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Razorpay Verify Payment Error]:', error);
    return NextResponse.json(
      ResponseUtil.failure(error?.message || 'Payment verification failed'),
      { status: 500 }
    );
  }
}
