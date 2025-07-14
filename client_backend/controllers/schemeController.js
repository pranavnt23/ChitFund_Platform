const mongoose = require('mongoose');  // ✅ Import mongoose
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Bid = require('../models/Bid');

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

// ✅ Place a bid for a scheme
exports.placeBid = async (req, res) => {
  const { userId, schemeId, bidAmount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const registeredScheme = user.schemes_registered.find(s => s.scheme_id.toString() === schemeId);
    if (!registeredScheme) {
      return res.status(404).json({ message: 'User not registered for this scheme' });
    }

    registeredScheme.bid_status.push({
      month: registeredScheme.months_completed + 1,
      bid_made: true,
      payment_made: 0 // to be updated later
    });

    registeredScheme.bids_made_count += 1;

    const bid = new Bid({ user_id: userId, scheme_id: schemeId, bid_amount: bidAmount });
    await bid.save();
    await user.save();

    res.json({ message: 'Bid placed successfully', bidAmount });
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
