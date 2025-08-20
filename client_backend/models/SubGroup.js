const mongoose = require('mongoose');

const subGroupSchema = new mongoose.Schema({
  subgroup_id: { type: String, required: true, unique: true },
  subgroup_name: { type: String, required: true },
  schemes_available: [
    {
      scheme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
      slot_ids: [
        {
          slot_id: { type: String, required: true },
          no_of_seats_left: { type: Number, required: true }
        }
      ]
    }
  ]
});

module.exports = mongoose.model('SubGroup', subGroupSchema);
