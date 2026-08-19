import { RedisClient } from "../config/redis.js";

export const rateLimiter = async (req, res, next) => {
    try {
        const { userId } = req.auth();

        // console.log(" RATE LIMITER RUNNING");
        // console.log("Clerk User:", userId);

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized. Please login first."
            });
        }

        const key = `documind:api_limit:${userId}`;

        const count = await RedisClient.get(key);

        // console.log("Redis Key:", key);
        // console.log("Current Count:", count);

        const LIMIT = 5;

        if (count && Number(count) >= LIMIT) {

            const ttl = await RedisClient.ttl(key);

            // console.log(" RATE LIMIT REACHED");
            // console.log("TTL:", ttl);

            return res.status(429).json({
                success: false,
                message: "API limit reached. Please try again later.",
                remainingTime: `${Math.ceil(ttl / 60)} minutes`
            });
        }

        if (!count) {

            await RedisClient.set(key, "1", {
                EX: 6 * 60 * 60
            });

           // console.log("✅ First request - Redis key created");

        } else {

            await RedisClient.incr(key);

           // console.log("✅ Request count increased");
        }

        next();

    } catch (error) {

        console.error("Rate limiter error:", error);

        return res.status(500).json({
            message: "Something went wrong with rate limiting."
        });
    }
};