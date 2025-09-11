const mongoose = require('mongoose');

const chitSlotSchema = new mongoose.Schema({
  subgroup_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SubGroup', required: false },
  slot_id: { type: String, required: true },
  users: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date_of_joining: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('ChitSlot', chitSlotSchema);
