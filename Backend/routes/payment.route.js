import express from "express";
import { createCheckoutSession, stripeWebhookHandler, getPublicKey } from "../controllers/payment.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);


router.post("/create-checkout-session", isAuthenticated, createCheckoutSession);


router.get("/public-key", (req, res) => getPublicKey(req, res));

export default router;
