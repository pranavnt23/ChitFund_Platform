// ./model/auction.js
const mongoose = require('mongoose');

// Define bid schema
const bidSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    auction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
    bid_amount: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

// Define auction schema
const auctionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    start_price: { type: Number, required: true },
    current_price: { type: Number, default: 0 },
    highest_bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    bids: [bidSchema]
});

// Create models
const Auction = mongoose.model('Auction', auctionSchema);
const Bid = mongoose.model('Bid', bidSchema);

module.exports = { Auction, Bid };
