const User = require('../models/User');
const Scheme = require('../models/Scheme');

exports.registerUser = async (req, res) => {
  try {
    const user = new User({
      ...req.body,
      asset_doc: {
        file_name: req.file?.filename || '',
        file_type: req.file?.mimetype || ''
      },
      schemes_registered: []
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getUserSchemes = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).populate('schemes_registered.scheme_id');

    const registeredSchemes = user.schemes_registered.map(s => ({
      scheme_id: s.scheme_id,
      bid_status: s.bid_status,
      months_completed: s.months_completed,
      bids_made_count: s.bids_made_count,
      has_won_bid: s.has_won_bid
    }));

    const completeRegisteredSchemes = await Promise.all(
      registeredSchemes.map(async (regScheme) => {
        const schemeDetails = await Scheme.findById(regScheme.scheme_id);
        return { ...regScheme, ...schemeDetails._doc };
      })
    );

    const availableSchemes = await Scheme.find({ number_of_slots: { $gt: 0 } });
    const fullSchemes = await Scheme.find({ number_of_slots: 0 });

    res.json({
      registeredSchemes: completeRegisteredSchemes,
      availableSchemes,
      fullSchemes
    });
  } catch (error) {
    console.error('Error fetching user schemes:', error);
    res.status(500).json({ message: 'Error fetching user schemes' });
  }
};
