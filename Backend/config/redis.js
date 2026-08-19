import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const RedisClient = createClient({
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD,

    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },
});

RedisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

RedisClient.on("connect", () => {
    console.log("Redis Connected");
});

RedisClient.on("ready", () => {
    console.log("Redis Ready");
});