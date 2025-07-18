const SubGroup = require('../models/subGroup');

// Create SubGroup
exports.createSubGroup = async (req, res) => {
  try {
    const newSubGroup = new SubGroup(req.body);
    const savedSubGroup = await newSubGroup.save();
    res.status(201).json(savedSubGroup);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create SubGroup', details: err.message });
  }
};

// Get All SubGroups
exports.getAllSubGroups = async (req, res) => {
  try {
    const subGroups = await SubGroup.find();
    res.json(subGroups);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch SubGroups', details: err.message });
  }
};

// Get SubGroups by Username
exports.getSubGroupsByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const subGroups = await SubGroup.find({ username });
    res.json(subGroups);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch SubGroups by username', details: err.message });
  }
};

// Update SubGroup
exports.updateSubGroup = async (req, res) => {
  try {
    const updatedSubGroup = await SubGroup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSubGroup) {
      return res.status(404).json({ error: 'SubGroup not found' });
    }
    res.json(updatedSubGroup);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update SubGroup', details: err.message });
  }
};

// Delete SubGroup
exports.deleteSubGroup = async (req, res) => {
  try {
    const deletedSubGroup = await SubGroup.findByIdAndDelete(req.params.id);
    if (!deletedSubGroup) {
      return res.status(404).json({ error: 'SubGroup not found' });
    }
    res.json({ message: 'SubGroup deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete SubGroup', details: err.message });
  }
};
