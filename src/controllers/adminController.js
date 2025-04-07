import Booking from '../models/Booking.js';

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll(); // Add `include` if you want flight/user details
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
