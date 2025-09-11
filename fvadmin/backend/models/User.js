const mongoose = require('mongoose');

const bidStatusSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  bid_made: { type: Boolean, required: true },
  bid_amount: { type: Number, required: true },  
  timestamp: { type: Date, default: Date.now },  
  payment_made: { type: Number, required: true }
});

const schemeRegisteredSchema = new mongoose.Schema({
  scheme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  slot_id: { type: String, required: true },
  subgroup_id: { type: String, required: false },  
  bid_status: [bidStatusSchema],
  months_completed: { type: Number, required: true, default: 0 },
  has_won_bid: { type: Boolean, required: true, default: false },
  current_bid_status: { type: Boolean, required: true, default: false }
});

// Full user profile schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  aadharno: { type: String, required: true },
  panno: { type: String, required: true },
  asset_doc: {
    file_name: { type: String },
    file_type: { type: String }
  },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  age: { type: Number },
  confirm_password: { type: String, required: true },
  schemes_registered: [schemeRegisteredSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
