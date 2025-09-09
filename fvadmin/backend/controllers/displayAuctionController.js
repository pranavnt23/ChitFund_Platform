const ChitGroupRandom = require('../models/chitGroupRandom');
const Group = require('../models/Group');
const Subgroup = require('../models/SubGroup');
const Slot = require('../models/ChitSlot');

// RANDOM - get all schemes in chit_groups_random
exports.getRandomSchemes = async (req, res) => {
  try {
    // Get ALL fields for each scheme/document
    const schemes = await ChitGroupRandom.find();
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RANDOM - get all slots under schemes in chit_groups_random, grouped by scheme
exports.getRandomSlots = async (req, res) => {
  try {
    // Fetch all documents from chit_groups_random with full data including embedded slot_ids
    const groups = await ChitGroupRandom.find();

    // Optionally transform data; here we send as-is
    res.json(groups);
  } catch (error) {
    console.error('Error fetching chit_groups_random:', error);
    res.status(500).json({ message: error.message });
  }
};

// CUSTOM - get all groups
exports.getCustomGroups = async (req, res) => {
  try {
    // Get ALL fields for each group/document
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CUSTOM - get all subgroups
exports.getCustomSubgroups = async (req, res) => {
  try {
    // Get ALL fields for each subgroup/document
    const subgroups = await Subgroup.find();
    res.json(subgroups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all slots 
exports.getCustomSlots = async (req, res) => {
  try {
    // Fetch all slots, optionally populate subgroup if needed
    const slots = await Slot.find()
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


