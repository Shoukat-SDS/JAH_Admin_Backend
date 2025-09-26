// backend/routes/authRoutes.js
import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middlewares/authMiddleware.js';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword,
  getUsers,
  updateUser,
  deleteUser
} from '../controllers/authController.js';

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.put('/reset/:token', resetPassword);

// Protected routes
router.use(protect);
router.post('/logout', logout);
router.get('/verify', getMe); // Using getMe handler for verify endpoint
router.get('/me', getMe);
router.put('/update', updateProfile);
router.put('/updatepass', updatePassword);

// Admin routes
router.use(authorize('admin', 'superAdmin'));
router.get('/users', getUsers);
router.route('/user/:id')
  .put(updateUser)
  .delete(deleteUser);

export default router;