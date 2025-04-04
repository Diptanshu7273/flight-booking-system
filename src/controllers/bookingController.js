const Booking = require("../models/Booking");
const Flight = require("../models/Flight");

exports.bookFlight = async (req, res) => {
  try {
    const { flightId, userId, seats, selectedSeats } = req.body;

    // Check if flight exists
    const flight = await Flight.findByPk(flightId);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    // Check seat availability
    if (flight.available_seats < seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Create booking
    const booking = await Booking.create({ flightId, userId, seats, selectedSeats });

    // Update available seats
    await flight.update({ available_seats: flight.available_seats - seats });

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    res.status(500).json({ message: "Error booking flight", error: error.message });
  }
};
