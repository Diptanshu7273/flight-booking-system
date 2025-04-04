const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { bookFlight } = require("../controllers/bookingController");

const router = express.Router();

router.post("/", authMiddleware, bookFlight); // Only authenticated users can book

module.exports = router;
