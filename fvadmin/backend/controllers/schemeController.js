const Scheme = require('../models/Scheme');
const User = require('../models/User');

exports.getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (err) {
    console.error("Error fetching schemes:", err);
    res.status(500).json({ error: 'Failed to fetch schemes' });
  }
};



exports.getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching scheme' });
  }
};

exports.createScheme = async (req, res) => {
  try {
    const scheme = new Scheme(req.body);
    await scheme.save();
    res.status(201).json(scheme);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add scheme', details: err.message });
  }
};

exports.updateScheme = async (req, res) => {
  try {
    const updated = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Scheme not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update scheme', details: err.message });
  }
};

exports.deleteScheme = async (req, res) => {
  try {
    await Scheme.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete scheme' });
  }
};

exports.searchSchemes = async (req, res) => {
  const { schemeid, schemename } = req.query;
  let query = {};

  if (schemeid && mongoose.Types.ObjectId.isValid(schemeid)) {
    query._id = schemeid;
  } else if (schemeid) {
    return res.status(400).json({ error: 'Invalid schemeid' });
  }

  if (schemename) query.name = { $regex: schemename, $options: 'i' };

  try {
    const schemes = await Scheme.find(query);
    const allUsers = await User.find().select('username fname lname email phone_number schemes_registered');

    const results = schemes.map(scheme => {
      const schemeIdStr = scheme._id.toString();
      const registered_users = allUsers.filter(user =>
        (user.schemes_registered || []).some(reg => reg.scheme_id?.toString() === schemeIdStr)
      ).map(user => ({
        _id: user._id,
        username: user.username,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phone_number: user.phone_number
      }));

      return { ...scheme.toObject(), registered_users };
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch schemes' });
  }
};
