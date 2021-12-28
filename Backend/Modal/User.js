const mongoose = require("mongoose");

const TradeSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    type: {
        type: String
    },
    user_id: {
        type: Number,
        required: true,
        trim: true
    },
    shares: {
        type: Number,
        required: true,
        trim: true
    },
    symbol: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: new Date().now
    },
});
module.exports = mongoose.model("trade", TradeSchema);