// backend/routes/donationRoutes.js
import express from "express";
import multer from "multer";
import {
  createDonation,
  getDonations,
  verifyDonation,
  deleteDonation,
  exportDonationsCSV,
  exportDonationsExcel
} from "../controllers/donationPaymentController.js";
import path from "path";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// File upload setup for invoices
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/invoices/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("invoice"), createDonation); // Add donation
router.get("/",  protect, authorize("superAdmin"), getDonations); // Get donations list
router.put("/:id/verify",  protect, authorize("superAdmin"), verifyDonation); // Verify donation
router.delete("/:id",  protect, authorize("superAdmin"), deleteDonation); // Delete donation
router.get("/export/csv",  protect, authorize("superAdmin"), exportDonationsCSV);
router.get("/export/excel",  protect, authorize("superAdmin"), exportDonationsExcel);

export default router;