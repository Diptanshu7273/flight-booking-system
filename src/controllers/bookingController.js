import Booking from "../models/Booking.js";
import Flight from "../models/Flight.js";
import redis from "../config/redis.js";
import { publishToQueue } from "../utils/rabbitmq.js";

export const bookFlight = async (req, res) => {
  try {
    const { flightId, seats, selectedSeats } = req.body;
    const userId = req.user.id; // from auth middleware
    const userEmail = req.user.email; // assuming email is in token payload

    // Check if flight exists
    const flight = await Flight.findByPk(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Check seat availability
    if (flight.available_seats < seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Create booking
    const booking = await Booking.create({
      flightId,
      userId,
      seats,
      selectedSeats,
    });

    // Update flight's available seats
    await flight.update({
      available_seats: flight.available_seats - seats,
    });

    // Invalidate Redis cache
    await Promise.all([
      redis.del(`bookings:user:${userId}`),
      redis.del("bookings:all"),
      redis.keys(`flights:*`).then(keys => keys.length && redis.del(keys)),
    ]);

    // 📩 Send booking data to RabbitMQ for email processing
    await publishToQueue("booking_emails", {
      to: userEmail,
      subject: "Booking Confirmation",
      text: `✅ Your booking for flight ID ${flightId} is confirmed.\n✈️ Seats booked: ${seats}\n💺 Selected Seats: ${selectedSeats?.join(", ")}`,
    });

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (error) {
    console.error("❌ Booking error:", error.message);
    res.status(500).json({ message: "Error booking flight", error: error.message });
  }
};
