const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const { addFlight, updateFlight, deleteFlight, getFlights, searchFlights} = require("../controllers/flightController");

const router = express.Router();

router.get("/", getFlights);
router.get("/search", searchFlights);
router.post("/", authMiddleware, adminMiddleware, addFlight);
router.put("/:id", authMiddleware, adminMiddleware, updateFlight);
router.delete("/:id", authMiddleware, adminMiddleware, deleteFlight);

module.exports = router;
