import express from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";
import { addFlight, updateFlight, deleteFlight, getFlights, searchFlights } from "../controllers/flightController.js";

const router = express.Router();

router.get("/", getFlights);
router.get("/search", searchFlights);
router.post("/", authMiddleware, adminMiddleware, addFlight);
router.put("/:id", authMiddleware, adminMiddleware, updateFlight);
router.delete("/:id", authMiddleware, adminMiddleware, deleteFlight);

export default router;
