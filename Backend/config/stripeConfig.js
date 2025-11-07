import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config(); // 👈 Load .env variables

// Check if key exists
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY not found in environment variables!");
} else {
  console.log("✅ Stripe key loaded successfully");
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
