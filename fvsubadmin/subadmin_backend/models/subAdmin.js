const mongoose = require('mongoose');

const subAdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  group_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  valid_till: { type: Date },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

module.exports = mongoose.model('SubAdmin', subAdminSchema);
