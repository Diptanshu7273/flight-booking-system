import { sendBookingConfirmationEmail } from './emailService.js'; // Assume emailService handles sending emails
import { Booking } from '../models'; // Assume Booking is a Sequelize model for booking
import { jest } from '@jest/globals';
/**
 * Create a new booking.
 * @param {Object} bookingData - Data to create a new booking.
 * @returns {Object} - Created booking.
 */
export const createBooking = async (bookingData) => {
  try {
    // Create the booking in the database
    const booking = await Booking.create(bookingData);

    // Send a booking confirmation email
    const emailSent = await sendBookingConfirmationEmail(
      bookingData.email,
      'Booking Confirmed',
      `<h1>Your booking is confirmed!</h1><p>Booking ID: ${booking.id}</p>`
    );

    if (emailSent) {
      return {
        message: 'Booking created and confirmation email sent.',
        booking,
      };
    } else {
      throw new Error('Failed to send confirmation email');
    }
  } catch (error) {
    throw new Error(`Booking creation failed: ${error.message}`);
  }
};

/**
 * Cancel a booking.
 * @param {number} bookingId - The ID of the booking to cancel.
 * @returns {string} - Success message.
 */
export const cancelBooking = async (bookingId) => {
  try {
    // Find the booking by ID
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Cancel the booking
    await booking.update({ status: 'cancelled' });

    return 'Booking cancelled successfully';
  } catch (error) {
    throw new Error(`Cancellation failed: ${error.message}`);
  }
};

/**
 * Get booking details by ID.
 * @param {number} bookingId - The ID of the booking.
 * @returns {Object} - Booking details.
 */
export const getBookingById = async (bookingId) => {
  try {
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    return booking;
  } catch (error) {
    throw new Error(`Failed to fetch booking: ${error.message}`);
  }
};
