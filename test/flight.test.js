import request from 'supertest';
import app from '../app.js';

describe('Flight routes', () => {
    it('should search flights', async () => {
        const res = await request(app)
          .get('/api/flights/search')
          .query({
            from: 'NYC',
            to: 'LAX',
            date: '2025-04-10',
          });
      
        expect(res.statusCode).toBe(200);
      }, 20000);
});

it('should search flights', async () => {
    console.log("➡️ Starting flight search test");
  
    const res = await request(app)
      .get('/api/flights/search')
      .query({ source: 'DEL', destination: 'BOM', date: '2025-04-10' });
  
    console.log("⬅️ Response received", res.statusCode, res.body);
  
    expect([200, 201]).toContain(res.statusCode);
  }, 20000);
  
