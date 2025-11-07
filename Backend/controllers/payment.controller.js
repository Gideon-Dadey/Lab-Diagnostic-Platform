import Stripe from "stripe";
import dotenv from "dotenv";
import { Order } from "../models/order.model.js";
 // adjust path if needed

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// 1️⃣ Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ message: "bookingId is required" });

    const order = await Order.findById(bookingId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const line_items = order.items.map((item) => ({
      price_data: {
        currency: "usd", // or your currency (e.g. 'ghs')
        product_data: { name: item.name },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Math.max(1, Number(item.quantity) || 1),
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&orderId=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL}/confirm-booking`,
      metadata: { bookingId },
    });

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 2️⃣ Stripe Webhook to confirm payment
export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;

    try {
      if (bookingId) {
        await Order.findByIdAndUpdate(bookingId, {
          paymentStatus: "paid",
          status: "Approved",
        });
        console.log(`✅ Order ${bookingId} marked as paid`);
      }
    } catch (err) {
      console.error("Error updating order after payment:", err);
    }
  }

  res.json({ received: true });
};

// 3️⃣ Public endpoint to provide publishable key to frontend
export const getPublicKey = async (req, res) => {
  try {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
    return res.status(200).json({ publishableKey });
  } catch (e) {
    return res.status(200).json({ publishableKey: "" });
  }
};
