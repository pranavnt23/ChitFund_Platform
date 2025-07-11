// models/biddingModel.js
const mongoose = require('mongoose');

const bidStatusSchema = new mongoose.Schema({
  month: { type: Number, required: true },     // Month number for the scheme
  bid_made: { type: Boolean, default: false }, // If a bid was made
  payment_made: { type: Number, default: 0 }   // Payment for the month
});

const schemeRegisteredSchema = new mongoose.Schema({
  scheme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  bid_status: [bidStatusSchema],               // Array to track bids for each month
  months_completed: { type: Number, default: 0 },
  bids_made_count: { type: Number, default: 0 },
  has_won_bid: { type: Boolean, default: false }
});

const userBidSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  schemes_registered: [schemeRegisteredSchema]  // Array of schemes the user is registered for
});

const UserBid = mongoose.model('UserBid', userBidSchema);

module.exports = UserBid;
