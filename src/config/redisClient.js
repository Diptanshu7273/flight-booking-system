import { createClient } from 'redis';

const redisClient = createClient();

redisClient.connect()
  .then(() => console.log('✅ Redis connected'))
  .catch((err) => console.error('❌ Redis connection failed:', err));

export default redisClient;
