import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { bookFlight } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", authMiddleware, bookFlight); // Only authenticated users can book

export default router;
