const RateLimit = require('../models/rate-limites');

const rateLimiter = async (req, res, next) => {
    const userId = req.ip; // Use user ID if authenticated, else use IP
    const currentTime = Date.now();

    try {
        // Check if the user already has a rate limit record
        let rateLimit = await RateLimit.findOne({ userId });

        if (!rateLimit) {
            // Create a new record if it doesn't exist
            rateLimit = new RateLimit({
                userId,
                requestCount: 1,
                lastRequestTime: currentTime
            });
            await rateLimit.save(); // Save the new rate limit record
        } else {
            // Check if the last request was within the last hour
            if (currentTime - rateLimit.lastRequestTime > 60 * 60 * 1000) {
                // 60 *
                // Reset count if the last request was over an hour ago
                rateLimit.requestCount = 1;
                rateLimit.lastRequestTime = currentTime;
            } else {
                // Increment request count if within the hour
                rateLimit.requestCount += 1;
            }

            // Check if the request count exceeds the limit
            if (rateLimit.requestCount > 100) {
                return res.status(429).json({ error: true, message: "Rate limit exceeded. Try again later." });
            }

            // Save the updated rate limit record
            await rateLimit.save();
        }

        next(); // Allow the request to continue
    } catch (error) {
        console.error("Rate limiter error:", error);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
};

module.exports = rateLimiter;
