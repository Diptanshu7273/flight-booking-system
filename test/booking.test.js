import app from '../src/app.js';
import request from 'supertest';
import { User } from '../src/models'; // Update path if needed

describe('Booking routes', () => {
  let token;

  beforeAll(async () => {
    // Register the test user
    await request(app).post('/api/register').send({
      email: 'testuser@example.com',
      password: 'testpass123',
      name: 'Test User'
    });

    // Now login to get the JWT token
    const loginRes = await request(app).post('/api/login').send({
      email: 'testuser@example.com',
      password: 'testpass123'
    });

    token = loginRes.body.token;
    console.log("✅ Token retrieved:", token);
  });

  test('should allow booking with valid token', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ flightId: 1, seats: 2 });

    console.log("📦 Booking Status:", res.statusCode);
    console.log("📦 Booking Body:", res.body);

    expect([200, 201]).toContain(res.statusCode);
  });

  afterAll(async () => {
    // Clean up test user
    await User.destroy({ where: { email: 'testuser@example.com' } });
  });
});
