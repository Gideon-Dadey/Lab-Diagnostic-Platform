import express from "express";
import {
  addLab,
  updateLab,
  deleteLab,
  
  getLab,
  getAllLabs,
  getPublicLabs,
  getPublicLabById,
  getAllLabsPublic,
  applyForLab,
  getLabApplications,
  updateLabApplicationStatus,
  addReview,
  getLabReviews
} from "../controllers/lab.controller.js";
import {  isAuthenticated, isLabAdmin, isSuperAdmin, protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import LabApplication from "../models/labApplication.model.js";

const router = express.Router();

router.post("/create", isAuthenticated, isSuperAdmin, upload.single("image"), addLab);
router.get("/", isAuthenticated, isSuperAdmin, getLab);
router.get("/all", isAuthenticated, isSuperAdmin, getAllLabs);

router.put("/:id",isAuthenticated, protect, upload.single("image"), updateLab);
router.delete("/:id", protect, deleteLab);


router.get("/public", getPublicLabs);
router.get("/public/:id", getPublicLabById); 


router.get("/get-all", getAllLabsPublic);


router.post("/apply", upload.single("labLicense"), applyForLab);
router.get("/applications", protect, getLabApplications);
router.put("/applications/:id/status", protect, updateLabApplicationStatus);


router.get('/applications/status', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const application = await LabApplication.findOne({ ownerEmail: email })
      .select('-__v')
      .sort({ createdAt: -1 });

    if (!application) {
      return res.status(404).json({ message: 'No application found for this email' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Error fetching application status:', error);
    res.status(500).json({ message: 'Error fetching application status' });
  }
});


router.post("/:labId/reviews", isAuthenticated, addReview);
router.get("/:labId/reviews", getLabReviews);

export default router;
