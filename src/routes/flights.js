import { Router } from "express";
import Flight from "../models/Flight.js";

const router = Router();

router.get("/search", async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    if (!source || !destination || !date) {
      return res.status(400).json({ message: "Missing search parameters" });
    }

    const flights = await Flight.findAll({
      where: {
        source,
        destination,
        departure_time: date // make sure the `date` format matches DB format
      }
    });

    res.json({ success: true, flights });
  } catch (error) {
    res.status(500).json({
      message: "Error searching flights",
      error: error.message
    });
  }
});

export default router;
