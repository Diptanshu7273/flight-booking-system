import request from 'supertest';
import app from '../app.js';

describe('Booking routes', () => {
  let token;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpass123' });

    console.log("Login Status:", loginRes.statusCode);
    console.log("Login Body:", loginRes.body);

    token = loginRes.body.token;
  });

  test('should allow booking with valid token', async () => {
    console.log("Token:", token); // ✅ Log token to ensure it's set

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ flightId: 1, seats: 2 });

    console.log("Status:", res.statusCode);
    console.log("Body:", res.body);

    expect([200, 201]).toContain(res.statusCode);
  });
});
