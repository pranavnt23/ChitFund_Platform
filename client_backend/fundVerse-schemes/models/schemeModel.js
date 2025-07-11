const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  target_audience: { type: String, required: true },
  investment_plan: {
    monthly_contribution: { min: Number, max: Number },
    chit_period: { min: Number, max: Number },
    total_fund_value: [{ duration: Number, min_value: Number, max_value: Number }]
  },
  benefits: [{ type: String }]
});

const Scheme = mongoose.model('Scheme', schemeSchema);

module.exports = Scheme;
