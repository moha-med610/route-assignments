import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URI,
});
export const redisConnect = async () => {
  try {
    await redisClient.connect();
    console.log("redis Connected Successfully");
  } catch (error) {
    console.log(`failed to connect redis : ${error}`);
  }
};
