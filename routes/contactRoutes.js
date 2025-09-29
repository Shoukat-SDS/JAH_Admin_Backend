// backend/routes/contactRoutes.js
import express from 'express'
import { authorize, protect } from '../middlewares/authMiddleware.js';
import {
    adminReply,
    createMessage,
    exportMessage,
    getAllMessage,
    resolvedMessage
} from '../controllers/contactController.js';


const router = express.Router();

router.post("/", createMessage);

// protect & authorization 
router.get('/getMessage', protect, authorize("superAdmin"), getAllMessage);
router.patch('/:id', protect, authorize("superAdmin"), resolvedMessage);
router.put("/:id/reply", protect, authorize("superAdmin"), adminReply);
router.get('/exports', protect, authorize("superAdmin"), exportMessage);

export default router