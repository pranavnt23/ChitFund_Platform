const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  group_id: { type: String, required: true, unique: true },
  group_name: { type: String, required: true },
  subgroup_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubGroup' }],
  group_password: { type: String, required: true },
  group_created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', groupSchema);
