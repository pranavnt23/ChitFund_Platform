const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: String,
  description: String,
  target_audience: String,
  investment_plan: {
    monthly_contribution: Number,
    chit_period: Number,
    total_fund_value: [
      {
        duration: Number,
        value: Number
      }
    ]
  },
  benefits: [String],
  icon: String,
  number_of_slots: Number
});

module.exports = mongoose.model('Scheme', schemeSchema);
