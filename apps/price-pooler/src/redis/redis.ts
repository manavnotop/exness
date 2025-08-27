import { createClient, RedisClientType } from "redis";

export const redis: RedisClientType = createClient({ url: "redis://localhost:6379" });

redis.on("error", (err) => console.error('redis client error', err))

let isConnected = false;

export async function connectRedis() {
  if (!isConnected) {
    await redis.connect();
    isConnected = true;
    console.log("✅ Redis connected in price-pooler");
  }
}