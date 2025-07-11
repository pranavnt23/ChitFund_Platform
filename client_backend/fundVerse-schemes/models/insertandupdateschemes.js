const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/FundVerse', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define the Scheme Schema
const schemeSchema = new mongoose.Schema({
  name: String,
  description: String,
  target_audience: String,
  investment_plan: {
    monthly_contribution: Number,
    chit_period: Number,
    total_fund_value: [{
      duration: Number,
      value: Number
    }]
  },
  benefits: [String],
  number_of_slots: Number // Add this field to the schema
});

// Create a model
const Scheme = mongoose.model('Scheme', schemeSchema);

// Sample schemes data
const schemes = [
  {
    name: "Gold Savings Scheme",
    description: "Members contribute a fixed amount monthly to accumulate gold or cash equivalent at the end of the chit period.",
    target_audience: "Individuals seeking stable, long-term savings in gold.",
    investment_plan: {
      monthly_contribution: 10000,
      chit_period: 12,
      total_fund_value: [
        { duration: 12, value: 120000 }
      ]
    },
    benefits: [
      "Redeemable in gold bars or coins, or in cash based on market rates.",
      "Option for early withdrawal or purchase from partnered jewelers at discounted rates."
    ]
  },
  {
    name: "Diamond Wealth Plan",
    description: "A premium chit plan designed for those interested in high-value luxury investments, redeemable in diamonds or cash.",
    target_audience: "High-net-worth individuals or luxury investors.",
    investment_plan: {
      monthly_contribution: 50000,
      chit_period: 12,
      total_fund_value: [
        { duration: 12, value: 600000 }
      ]
    },
    benefits: [
      "High-value rewards including exclusive diamond pieces or the equivalent cash value.",
      "Access to luxury brands and bespoke jewelry options.",
      "Special discounts with diamond merchants."
    ]
  },
  {
    name: "Silver Harvest Scheme",
    description: "A more affordable chit plan for those looking to invest smaller amounts and save towards silver or cash rewards.",
    target_audience: "Medium-income groups or small investors.",
    investment_plan: {
      monthly_contribution: 2000,
      chit_period: 12,
      total_fund_value: [
        { duration: 12, value: 24000 }
      ]
    },
    benefits: [
      "Redeemable for silver or cash with flexible redemption terms.",
      "Discounts or benefits with partnered silver dealers for jewelry or bullion purchases."
    ]
  },
  {
    name: "Platinum Prestige Scheme",
    description: "A premium plan targeted at higher-income investors looking to diversify in platinum assets.",
    target_audience: "Upper-middle-class individuals or those seeking unique investment options.",
    investment_plan: {
      monthly_contribution: 25000,
      chit_period: 12,
      total_fund_value: [
        { duration: 12, value: 300000 }
      ]
    },
    benefits: [
      "Redeemable in platinum bullion or jewelry, with a cash option available.",
      "Exclusive offers and partnerships with platinum dealers.",
      "Flexible withdrawal options after half the chit period."
    ]
  },
  {
    name: "Education Savings Scheme",
    description: "This chit scheme is designed to help families save for higher education or other educational expenses.",
    target_audience: "Parents or guardians planning for children’s education.",
    investment_plan: {
      monthly_contribution: 5000,
      chit_period: 12,
      total_fund_value: [
        { duration: 12, value: 60000 }
      ]
    },
    benefits: [
      "Funds redeemable for education-related costs or as a lump sum payout.",
      "Partnerships with educational institutions or scholarship programs."
    ]
  },
  {
    name: "Travel Dream Scheme",
    description: "A travel-focused chit fund designed for individuals or families who wish to save towards a dream vacation or travel-related expenses.",
    target_audience: "Frequent travelers or families planning vacations.",
    investment_plan: {
      monthly_contribution: 5000,
      chit_period: 12,
      total_fund_value: [
        { duration: 12, value: 60000 }
      ]
    },
    benefits: [
      "Redeemable for travel vouchers, holiday packages, or cash.",
      "Partnerships with travel agencies, airlines, or hotels for discounted bookings.",
      "Flexible plan adjustments for last-minute bookings or trip changes."
    ]
  },
  {
    name: "Wedding Bliss Fund",
    description: "This scheme is designed to help families save towards wedding expenses, allowing them to accumulate a sizable amount for the big day.",
    target_audience: "Families or couples planning weddings.",
    investment_plan: {
      monthly_contribution: 10000,
      chit_period: 12,
      total_fund_value: [
        { duration: 12, value: 120000 }
      ]
    },
    benefits: [
      "Redeemable in cash or in wedding services (venue, catering, photography, etc.).",
      "Partnerships with wedding vendors for discounted services.",
      "Early redemption options to assist in wedding planning."
    ]
  },
  {
    name: "Tech Gadget Scheme",
    description: "A scheme that allows participants to save up for the latest technology gadgets, electronics, or devices.",
    target_audience: "Tech enthusiasts or families looking to invest in technology upgrades.",
    investment_plan: {
      monthly_contribution: 2000,
      chit_period: 12,
      total_fund_value: [
        { duration: 12, value: 24000 }
      ]
    },
    benefits: [
      "Redeemable for popular gadgets like smartphones, laptops, or home electronics, or for cash.",
      "Special offers and tie-ups with electronics stores for additional discounts.",
      "Flexibility to swap products based on user preferences and market trends."
    ]
  },
  {
    name: "Healthcare Savings Plan",
    description: "A scheme for individuals and families to save for medical emergencies or planned healthcare expenses.",
    target_audience: "Health-conscious individuals or families planning for future medical costs.",
    investment_plan: {
      monthly_contribution: 5000,
      chit_period: 12,
      total_fund_value: [
        { duration: 12, value: 60000 }
      ]
    },
    benefits: [
      "Redeemable for healthcare services (hospitalization, surgeries, checkups) or cash.",
      "Partnerships with hospitals, clinics, or insurance providers for discounts.",
      "Flexibility to use the funds for preventive healthcare or medical emergencies."
    ]
  }
];

// Insert the schemes into the database
Scheme.insertMany(schemes)
  .then(() => {
    console.log('Schemes inserted successfully!');
    // Now update all schemes to add number_of_slots
    return Scheme.updateMany({}, { $set: { number_of_slots: 10 } });
  })
  .then((result) => {
    console.log(`${result.modifiedCount} documents updated with number_of_slots.`);
    mongoose.connection.close(); // Close the connection
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.connection.close(); // Close the connection in case of an error
  });
