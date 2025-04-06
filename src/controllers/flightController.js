import redis from "../config/redis.js";
import Flight from "../models/Flight.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { publishToQueue } from "../utils/rabbitmq.js";

const clearFlightCache = async (flight) => {
  const pattern = `flights:${flight.source}:${flight.destination}:*`;
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(keys);
  }
};

// GET all flights
export const getFlights = async (req, res) => {
  try {
    const flights = await Flight.findAll();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flights", error: error.message });
  }
};

// ADD a flight
export const addFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    await clearFlightCache(flight);
    res.status(201).json({ message: "Flight added", flight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE flight (reschedule)
export const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    await flight.update(req.body);
    await clearFlightCache(flight);

    // Notify users if rescheduled
    const bookings = await Booking.findAll({
      where: { flightId: flight.id },
      include: [{ model: User, attributes: ["email"] }],
    });

    for (const booking of bookings) {
      if (booking.User?.email) {
        await publishToQueue("flight_notifications", {
          to: booking.User.email,
          subject: "Flight Rescheduled",
          text: `Your flight ${flight.id} has been rescheduled. Please check the updated details.`,
        });
        console.log(`📨 Queued email to ${booking.User.email} about flight ${flight.id}`);
      }
    }

    res.status(200).json({ message: "Flight updated", flight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE flight (cancel)
export const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    await clearFlightCache(flight);

    const bookings = await Booking.findAll({
      where: { flightId: flight.id },
      include: [{ model: User, attributes: ["email"] }],
    });

    for (const booking of bookings) {
      if (booking.User?.email) {
        await publishToQueue("flight_notifications", {
          to: booking.User.email,
          subject: "Flight Cancelled",
          text: `Your flight ${flight.id} has been cancelled. We apologize for the inconvenience.`,
        });
      }
    }

    await flight.destroy();

    res.status(200).json({ message: "Flight deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SEARCH flights (with Redis caching)
export const searchFlights = async (req, res) => {
  const { source, destination, date, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const cacheKey = `flights:${source}:${destination}:${date}:page:${page}:limit:${limit}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("🔁 Served from cache");
      return res.status(200).json(JSON.parse(cached));
    }

    const flights = await Flight.findAll({
      where: { source, destination, date },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["departure_time", "ASC"]],
    });

    await redis.set(cacheKey, JSON.stringify(flights), "EX", 300);
    res.status(200).json(flights);
  } catch (error) {
    console.error("❌ Flight search error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateFlightStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const flight = await Flight.findByPk(id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    flight.status = status;
    await flight.save();

    // Emit to all clients
    const io = req.app.get("io");
    io.emit("flight-status-update", {
      flightId: flight.id,
      status: flight.status,
    });

    res.json({ message: 'Flight status updated', flight });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};