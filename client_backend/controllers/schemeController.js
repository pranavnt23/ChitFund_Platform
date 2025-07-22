const mongoose = require('mongoose');  
const User = require('../models/User');
const Scheme = require('../models/Scheme');

// ✅ Fetch all schemes
exports.getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.status(200).json(schemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ error: 'Error fetching schemes' });
  }
};

// ✅ Fetch scheme by ID
exports.getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching scheme with ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format for:", id);
      return res.status(400).json({ error: 'Invalid scheme ID format' });
    }

    const scheme = await Scheme.findById(id);
    console.log("Fetched Scheme:", scheme);

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.status(200).json(scheme);
  } catch (error) {
    console.error('Error fetching scheme details:', error);
    res.status(500).json({ error: 'Error fetching scheme details' });
  }
};

// ✅ Register user for a scheme
exports.registerForScheme = async (req, res) => {
  const { username, schemeId } = req.body;

  try {
    const user = await User.findOne({ username });
    const scheme = await Scheme.findById(schemeId);

    if (!user || !scheme) {
      return res.status(404).json({ message: 'User or Scheme not found' });
    }

    if (scheme.number_of_slots <= 0) {
      return res.status(400).json({ message: 'No slots available for this scheme' });
    }

    scheme.number_of_slots -= 1;
    await scheme.save();

    user.schemes_registered.push({
      scheme_id: schemeId,
      bid_status: [],
      months_completed: 0,
      bids_made_count: 0,
      has_won_bid: false
    });

    await user.save();
    res.status(200).json({ message: 'Successfully registered for the scheme!' });
  } catch (error) {
    console.error('Error registering for the scheme:', error);
    res.status(500).json({ message: 'Error registering for the scheme' });
  }
};

