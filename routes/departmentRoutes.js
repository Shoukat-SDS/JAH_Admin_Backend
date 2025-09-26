// backend/routes/departmentRoutes.js
import express from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from "../controllers/departmentController.js";

import upload from "../middlewares/uploadMiddleware.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getDepartments);
router.get("/:id", getDepartmentById);

// ADMIN ONLY
router.post("/", protect, authorize("superAdmin"), upload.single("image"), createDepartment);
router.put("/:id", protect, authorize("superAdmin"), upload.single("image"), updateDepartment);
router.delete("/:id", protect, authorize("superAdmin"), deleteDepartment);

export default router;
