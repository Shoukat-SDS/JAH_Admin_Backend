import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getFeaturedProjects
} from "../controllers/projectController.js";

import upload from "../middlewares/uploadMiddleware.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getProjects);
router.get("/featured", getFeaturedProjects);
router.get("/:id", getProjectById);

// ADMIN ONLY
router.post("/", protect, authorize("superAdmin"), upload.array("images", 5), createProject);
router.put("/:id", protect, authorize("superAdmin"), upload.array("images", 5), updateProject);
router.delete("/:id", protect, authorize("superAdmin"), deleteProject);

export default router;
