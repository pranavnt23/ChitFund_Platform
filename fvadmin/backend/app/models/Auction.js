const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  auction_status: { type: String, enum: ['live', 'not live'], default: 'not live' },
  auction_left_months: { type: Number, required: true },
  slot_id: { type: String, required: true },
  auction_details: {
    auction_winner_username: { type: String },
    winning_amount_bidded: { type: Number },
    amount_returned_to_each_user: { type: Number },
    auction_start_timestamp: { type: Date },
    auction_end_timestamp: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model('Auction', auctionSchema);
