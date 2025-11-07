










import express from "express";
import { getTestRecommendation } from "../controllers/recommendation.controller.js";
const router = express.Router();

router.post("/recommend-tests", getTestRecommendation);

export default router;