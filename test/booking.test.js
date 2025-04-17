import { jest } from '@jest/globals';
import { createBooking, getBookingById, cancelBooking } from '../src/services/bookingService.js'; // Ensure proper import
import app from '../src/app.js'; // Import the app
import request from 'supertest';

jest.mock('../src/services/bookingService.js'); // Mock the entire service

describe('Booking Service', () => {
  beforeAll(() => {
    jest.clearAllMocks(); // Clear mocks before each test to prevent any interference
  });

  it('should create a booking and send a confirmation email', async () => {
    const bookingMock = { userId: 1, flightId: 2, seatNumber: '12A' };
    const createBookingResult = { bookingId: 1 };

    // Mock the createBooking function to resolve successfully with booking details
    createBooking.mockResolvedValue(createBookingResult);

    const res = await request(app)
      .post('/api/bookings')
      .send(bookingMock);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('bookingId'); // Check that bookingId exists
    expect(createBooking).toHaveBeenCalledWith(bookingMock); // Verify the mock was called with the correct args
  });

  it('should handle errors when creating a booking', async () => {
    const bookingMock = { userId: 1, flightId: 2, seatNumber: '12A' };

    // Mock the createBooking function to throw an error
    createBooking.mockRejectedValue(new Error('Booking creation failed'));

    await expect(createBooking(bookingMock)).rejects.toThrow('Booking creation failed');
  });

  it('should fetch a booking by ID', async () => {
    const bookingId = 1;
    const bookingData = { bookingId, userId: 1, flightId: 2, seatNumber: '12A' };

    // Mock the getBookingById function
    getBookingById.mockResolvedValue(bookingData);

    const res = await request(app)
      .get(`/api/bookings/${bookingId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(bookingData); // Verify that the correct data is returned
    expect(getBookingById).toHaveBeenCalledWith(bookingId); // Verify the mock was called correctly
  });

  it('should handle errors when fetching a booking by ID', async () => {
    const bookingId = 1;

    // Mock the getBookingById function to throw an error
    getBookingById.mockRejectedValue(new Error('Booking not found'));

    await expect(getBookingById(bookingId)).rejects.toThrow('Booking not found');
  });

  it('should cancel a booking successfully', async () => {
    const bookingId = 1;

    // Mock the cancelBooking function
    cancelBooking.mockResolvedValue({ message: 'Booking canceled successfully' });

    const res = await request(app)
      .delete(`/api/bookings/${bookingId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Booking canceled successfully'); // Check if the cancellation message is correct
    expect(cancelBooking).toHaveBeenCalledWith(bookingId); // Ensure the mock was called with the right argument
  });

  it('should handle errors when canceling a booking', async () => {
    const bookingId = 1;

    // Mock the cancelBooking function to throw an error
    cancelBooking.mockRejectedValue(new Error('Booking cancellation failed'));

    await expect(cancelBooking(bookingId)).rejects.toThrow('Booking cancellation failed');
  });
});
