const mongoose = require('mongoose');

const subAdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fname: { type: String },
  lname: { type: String },
  email: { type: String },
  phone_number: { type: String },
  group_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  valid_till: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

module.exports = mongoose.model('SubAdmin', subAdminSchema);
