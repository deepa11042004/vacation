import Razorpay from 'razorpay';
import crypto from 'crypto';

export class RazorpayService {
  private static instance: Razorpay | null = null;

  public static getClient(): Razorpay {
    if (!this.instance) {
      const key_id = process.env.RAZORPAY_KEY_ID;
      const key_secret = process.env.RAZORPAY_KEY_SECRET;

      if (!key_id || !key_secret) {
        throw new Error('Razorpay API keys (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) are missing from environment variables.');
      }

      this.instance = new Razorpay({
        key_id,
        key_secret,
      });
    }

    return this.instance;
  }

  /**
   * Create a new Razorpay order
   * @param amount Amount in INR (e.g. 500 for ₹500)
   * @param currency Default is 'INR'
   * @param receipt Unique receipt identifier
   * @param notes Additional key-value metadata
   */
  public static async createOrder(
    amount: number,
    receipt: string,
    notes: Record<string, string | number> = {},
    currency: string = 'INR'
  ) {
    const rzp = this.getClient();
    // Razorpay expects amount in smallest currency sub-unit (paise for INR, i.e., amount * 100)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt,
      notes,
    };

    const order = await rzp.orders.create(options);
    return order;
  }

  /**
   * Verify Razorpay payment signature
   * @param orderId Razorpay order ID
   * @param paymentId Razorpay payment ID
   * @param signature Signature received from frontend checkout
   */
  public static verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      throw new Error('RAZORPAY_KEY_SECRET is missing from environment variables.');
    }

    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  }

  /**
   * Verify Razorpay Webhook signature
   * @param body Raw string body of webhook request
   * @param signature Header 'x-razorpay-signature'
   */
  public static verifyWebhookSignature(
    body: string,
    signature: string
  ): boolean {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  }
}
