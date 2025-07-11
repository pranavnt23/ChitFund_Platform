const Query = require('../models/Query');

exports.saveQuery = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newQuery = new Query({ name, email, message });
    await newQuery.save();
    res.status(201).json({ message: 'Query saved successfully' });
  } catch (error) {
    console.error('Error saving query:', error);
    res.status(500).json({ message: 'Error saving query' });
  }
};
