const mongoose = require('mongoose');

const chitGroupRandomSchema = new mongoose.Schema({
  scheme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  slot_ids: [{
    slot_id: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    number_of_seats_left: { type: Number, required: true, default: 0 }  // Correct field name and type
  }]
}, { collection: 'chit_groups_random' });

// Use mongoose.models to avoid OverwriteModelError in server reload/hot-restart situations
module.exports = mongoose.models.ChitGroupRandom || mongoose.model('ChitGroupRandom', chitGroupRandomSchema);
