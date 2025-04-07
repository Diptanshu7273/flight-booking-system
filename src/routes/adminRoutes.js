import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { getAllBookings } from '../controllers/adminController.js';

const router = express.Router();

router.get('/bookings', (req, res, next) => {
    console.log("✅ Admin route hit");
    next();
  }, authMiddleware, adminMiddleware, getAllBookings);
  

export default router;
