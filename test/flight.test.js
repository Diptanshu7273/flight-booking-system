// ✅ Ensure Jest uses ESM mocking
import { jest } from '@jest/globals';

// ✅ Mock the Redis client to avoid real connection issues
jest.unstable_mockModule('../src/config/redisClient.js', () => ({
  default: {
    get: jest.fn().mockResolvedValue(null), // No cache
    setEx: jest.fn().mockResolvedValue('OK') // Pretend caching succeeded
  }
}));

// ✅ Import everything AFTER the mock
import request from 'supertest';
const { default: app } = await import('../src/app.js');

describe('Flight routes', () => {
  it('should search flights', async () => {
    console.log("➡️ Starting flight search test");

    const res = await request(app)
      .get('/api/flights/search')
      .query({
        source: 'NYC',
        destination: 'LAX',
        date: '2025-04-15'
      });

    console.log("📦 Status Code:", res.statusCode);
    console.log("📦 Response Body:", res.body);

    expect(res.statusCode).toBe(200); // or [200, 201] if needed
  }, 20000);
});
