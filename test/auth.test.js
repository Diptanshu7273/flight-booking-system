import app from '../src/app.js';
import request from 'supertest';
import User from '../src/models/User.js'; // ✅ Add this line

beforeAll(async () => {
  await User.destroy({ where: { email: 'testuser@example.com' } });
});

describe('Auth routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpass123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('testuser@example.com');
  });

  it('should log in the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'testpass123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
