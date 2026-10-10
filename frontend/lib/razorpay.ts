/**
 * Helper to dynamically load the Razorpay checkout script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export interface RazorpayCheckoutOptions {
  amount: number; // in INR
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  orderId?: string;
  membershipId?: number;
  clientId?: number;
  amcPaymentId?: number;
  paymentType?: "DOWN_PAYMENT" | "INSTALMENT" | "AMC" | "PENALTY";
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onDismiss?: () => void;
}

export const processRazorpayPayment = async (options: RazorpayCheckoutOptions) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // 1. Create order on backend API
  const orderRes = await fetch(`${API_URL}/api/payments/razorpay/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: options.amount,
      currency: options.currency || "INR",
      membership_id: options.membershipId,
      client_id: options.clientId,
      amc_payment_id: options.amcPaymentId,
      payment_type: options.paymentType || "ONLINE",
      notes: options.notes || {},
    }),
  });

  const orderData = await orderRes.json();

  if (!orderRes.ok || !orderData.success) {
    throw new Error(orderData.message || "Failed to initialize payment gateway order.");
  }

  const { order_id, amount, currency, key_id } = orderData.data;

  // 2. Configure Razorpay modal
  const rzpOptions = {
    key: key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_Tl28yGXjJxdA8s",
    amount: amount,
    currency: currency || "INR",
    name: options.name || "Mandarin Worldwide Vacations",
    description: options.description || "Vacation Membership Payment",
    image: options.image || "/favicon.ico",
    order_id: order_id,
    handler: async (response: any) => {
      try {
        // 3. Verify signature on backend API
        const verifyRes = await fetch(`${API_URL}/api/payments/razorpay/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            membership_id: options.membershipId,
            client_id: options.clientId,
            amc_payment_id: options.amcPaymentId,
            payment_type: options.paymentType || "DOWN_PAYMENT",
            amount: options.amount,
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.success) {
          throw new Error(verifyData.message || "Payment verification failed.");
        }

        options.onSuccess(response);
      } catch (err: any) {
        alert(err.message || "Payment verification failed");
      }
    },
    prefill: {
      name: options.prefill?.name || "",
      email: options.prefill?.email || "",
      contact: options.prefill?.contact || "",
    },
    notes: options.notes || {},
    theme: {
      color: "#D4AF37", // Matching golden theme
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) options.onDismiss();
      },
    },
  };

  const razorpayWindow = new (window as any).Razorpay(rzpOptions);
  razorpayWindow.open();
};
