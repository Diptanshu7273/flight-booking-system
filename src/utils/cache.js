import redis from "../config/redis.js";

export const clearFlightCache = async (flight) => {
  const cacheKey = `flights:${flight.source}:${flight.destination}:${flight.date}`;
  try {
    await redis.del(cacheKey);
    console.log(`🧹 Cleared cache for key: ${cacheKey}`);
  } catch (err) {
    console.error("❌ Failed to clear cache:", err.message);
  }
};
