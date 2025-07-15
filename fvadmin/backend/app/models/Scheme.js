const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  target_audience: { type: String, required: true },
  investment_plan: {
    monthly_contribution: { type: Number, required: true },
    chit_period: { type: Number, required: true },
    total_fund_value: [
      {
        duration: { type: Number, required: true },
        value: { type: Number, required: true }
      }
    ]
  },
  number_of_slots: { type: Number, required: true },
  benefits: [{ type: String }]
});

module.exports = mongoose.model('Scheme', schemeSchema);
