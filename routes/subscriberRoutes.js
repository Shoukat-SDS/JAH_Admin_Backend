import express from "express";
import {
  getSubscribers,
  createSubscriber,
  exportSubscribersCSV,
  banSubscriber,
  deleteSubscriber
} from "../controllers/subscriberController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// NEWSLETTERS ADMIN ROUTES
router.post("/subscribe", createSubscriber);

router.get("/", protect, authorize("superAdmin"), getSubscribers);
router.get("/export-csv", protect, authorize("superAdmin"), exportSubscribersCSV);
router.put("/ban/:id", protect, authorize("superAdmin"), banSubscriber);
router.delete("/delete/:id", protect, authorize("superAdmin"), deleteSubscriber);

export default router;