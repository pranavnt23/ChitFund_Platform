const mongoose = require('mongoose');

const chitGroupRandomSchema = new mongoose.Schema({
  scheme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  slot_ids: [{
    slot_id: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  }]
}, { collection: 'chit_groups_random' });

module.exports = mongoose.model('ChitGroupRandom', chitGroupRandomSchema);
