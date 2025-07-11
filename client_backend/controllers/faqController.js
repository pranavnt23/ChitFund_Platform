const Faq = require('../models/Faq');

exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Error fetching FAQs' });
  }
};
