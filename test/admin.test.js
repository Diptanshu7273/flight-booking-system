import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models/index.js';

describe('Admin routes', () => {
  let adminToken, userToken;

  beforeAll(async () => {
    // Register admin and user
    await request(app).post('/api/register').send({
      email: 'admin@example.com',
      password: 'adminpass123',
      name: 'Admin User',
      role: 'admin'
    });

    await request(app).post('/api/register').send({
      email: 'user@example.com',
      password: 'userpass123',
      name: 'Normal User'
    });

    const adminLogin = await request(app).post('/api/login').send({
      email: 'admin@example.com',
      password: 'adminpass123'
    });
    adminToken = adminLogin.body.token;

    const userLogin = await request(app).post('/api/login').send({
      email: 'user@example.com',
      password: 'userpass123'
    });
    userToken = userLogin.body.token;
  });

  it('should not allow normal user to access admin bookings', async () => {
    const res = await request(app)
      .get('/api/admin/bookings')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Access Denied. Admins only.');
  });

  it('should allow admin to access admin bookings', async () => {
    const res = await request(app)
      .get('/api/admin/bookings')
      .set('Authorization', `Bearer ${adminToken}`);

    expect([200, 201]).toContain(res.statusCode);
  });

  it('should reject unauthenticated access', async () => {
    const res = await request(app).get('/api/admin/bookings');
    expect(res.statusCode).toBe(401);
  });

  afterAll(async () => {
    await User.destroy({ where: { email: ['admin@example.com', 'user@example.com'] } });
  });
});
