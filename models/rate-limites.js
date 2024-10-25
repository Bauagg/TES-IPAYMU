const mongoose = require('mongoose');

const rateLimitSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'user Id harus di isi'],
        unique: true
    },
    requestCount: {
        type: Number,
        default: 0
    },
    lastRequestTime: {
        type: Date,
        default: Date.now()
    }
});

const RateLimit = mongoose.model('RateLimit', rateLimitSchema);
module.exports = RateLimit;
