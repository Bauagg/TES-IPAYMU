const cron = require('node-cron');
const RateLimit = require('../models/rate-limites'); // Adjust the path as needed

// Schedule a job to run every minute
const startRateLimitCron = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const currentTime = Date.now();
            const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
            // 60 *

            // Find all users with lastRequestTime older than 1 hour
            const usersToReset = await RateLimit.find({
                lastRequestTime: { $lt: currentTime - oneHour }
            });

            if (usersToReset.length > 0) {
                // Reset requestCount for users who meet the condition
                await RateLimit.updateMany(
                    { lastRequestTime: { $lt: currentTime - oneHour } },
                    { requestCount: 0 }
                );
                console.log(`Rate limit counts reset to 0 for ${usersToReset.length} users.`);
            } else {
                console.log('No rate limit counts to reset.');
            }
        } catch (error) {
            console.error('Error resetting rate limit counts:', error);
        }
    });
};

module.exports = startRateLimitCron;
