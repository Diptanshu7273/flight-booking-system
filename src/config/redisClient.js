import { createClient } from 'redis';

let redisClient;

if (process.env.NODE_ENV === 'test') {
  // Mocked or fake redis client for tests
  redisClient = {
    connect: async () => {},
    get: async () => null,
    set: async () => {},
    setEx: async () => {},
    // Add other redis methods as needed
  };
  console.log('🧪 Using fake Redis client in test environment');
} else {
  redisClient = createClient();
  redisClient.connect()
    .then(() => console.log('✅ Redis connected'))
    .catch((err) => console.error('❌ Redis connection failed:', err));
}

export default redisClient;
