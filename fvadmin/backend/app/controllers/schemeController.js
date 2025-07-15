const Scheme = require('../models/Scheme');

exports.getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch schemes' });
  } 
};

exports.getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;
    const scheme = await Scheme.findById(id);
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
