import express from "express";
import { bookFlight } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", bookFlight);

export default router;
