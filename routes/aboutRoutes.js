import express from "express";
import { getAbout, updateAbout } from "../controllers/aboutController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAbout);

// Admin only
router.put("/", protect, authorize("superAdmin"), upload.array("images", 5), updateAbout);

export default router;
