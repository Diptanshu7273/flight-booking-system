const express = require("express");
const router = express.Router();
const { bookFlight } = require("../controllers/bookingController");

router.post("/", bookFlight); // Ensure this is present

module.exports = router;
