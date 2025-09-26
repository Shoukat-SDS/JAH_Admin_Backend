// backend/routes/blogRoutes.js
import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  createCategory,
  getCategories
} from "../controllers/blogController.js";

import upload from "../middlewares/uploadMiddleware.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// CATEGORY ROUTES
router.post("/categories", protect, authorize("superAdmin"), createCategory);
router.get("/categories", getCategories);

// BLOG ROUTES
router.get("/", protect, getBlogs);
router.get("/:slug", getBlogBySlug);

router.post("/", protect, authorize("superAdmin"), upload.single("thumbnail"), createBlog);
router.put("/:id", protect, authorize("superAdmin"), upload.single("thumbnail"), updateBlog);
router.delete("/:id", protect, authorize("superAdmin"), deleteBlog);

export default router;
