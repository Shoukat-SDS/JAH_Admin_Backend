// routes/donationItemRoutes.js
import express from "express";
import multer from "multer";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import {
  addDonation,
  getDonation,
  listDonations,
  removeDonation,
  updateDonation,
} from "../controllers/donationItemController.js";

const router = express.Router();


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public Routes
router.get("/list", listDonations);
router.get("/single", getDonation);

// Admin Routes
router.post("/add", protect, authorize("superAdmin"), addDonation);
router.put("/update", upload.single('image'), protect, authorize("superAdmin"), updateDonation);
router.delete("/delete", protect, authorize("superAdmin"), removeDonation);
export default router;