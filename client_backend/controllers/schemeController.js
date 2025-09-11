const mongoose = require('mongoose');  
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const SubGroup = require('../models/SubGroup');
const ChitSlot = require('../models/ChitSlot');
const ChitGroupRandom = require('../models/ChitGroupRandom');

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

// Utility function to get next slot ID
async function getNextSlotId() {
  try {
    const lastSlot = await ChitSlot.findOne({}, { slot_id: 1 })
      .sort({ slot_id: -1 })
      .limit(1);
    if (!lastSlot || !lastSlot.slot_id) return 'S001';
    const numPart = parseInt(lastSlot.slot_id.slice(1));
    return `S${String(numPart + 1).padStart(3, '0')}`;
  } catch (error) {
    console.error("Error getting next slot ID:", error);
    return 'S001';
  }
}

// Custom Register for Scheme with seat decrement in SubGroup slot
exports.customRegisterForScheme = async (req, res) => {
  const { username, password, schemeId, subgroupId, slotId, bankAcc, aadhar, ifsc, bankingName } = req.body;

  if (!username || !password || !schemeId || !subgroupId || !slotId || !bankAcc || !aadhar || !ifsc || !bankingName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.password !== password) return res.status(401).json({ message: 'Invalid password' });

    const subgroup = await SubGroup.findOne({ subgroup_id: subgroupId });
    if (!subgroup) return res.status(404).json({ message: 'SubGroup not found' });

    const schemeEntry = subgroup.schemes_available.find(s => s.scheme_id.toString() === schemeId);
    if (!schemeEntry) return res.status(400).json({ message: 'Scheme not available under this subgroup' });

    const slotEntry = schemeEntry.slot_ids.find(s => s.slot_id === slotId);
    if (!slotEntry) return res.status(400).json({ message: 'Slot ID not found under this scheme in subgroup' });

    if (slotEntry.no_of_seats_left <= 0) return res.status(400).json({ message: 'No seats left in this slot' });

    const alreadyRegistered = user.schemes_registered.some(s => s.scheme_id.toString() === schemeId);
    if (alreadyRegistered) return res.status(400).json({ message: 'User already registered for this scheme' });

    let chitSlot = await ChitSlot.findOne({ subgroup_id: subgroup._id, slot_id: slotId });
    if (!chitSlot) chitSlot = new ChitSlot({ subgroup_id: subgroup._id, slot_id: slotId, users: [] });

    if (chitSlot.users.some(u => u.user_id.toString() === user._id.toString()))
      return res.status(400).json({ message: 'User already registered in this slot' });

    chitSlot.users.push({ user_id: user._id, date_of_joining: new Date() });
    await chitSlot.save();

    // Decrement no_of_seats_left in subgroup slot entry
    slotEntry.no_of_seats_left -= 1;
    await subgroup.save();

    user.schemes_registered.push({
      scheme_id: schemeId,
      slot_id: slotId,
      bid_status: [],
      months_completed: 0,
      has_won_bid: false,
      current_bid_status: false
    });
    await user.save();

    return res.status(200).json({ message: 'Successfully registered with custom slot' });
  } catch (error) {
    console.error('Error in customRegisterForScheme:', error);
    res.status(500).json({ message: 'Internal server error during registration', error: error.message });
  }
};

// Random Register for Scheme with seat decrement in chitGroupsRandom slot
exports.randomRegisterForScheme = async (req, res) => {
  const { username, password, schemeId, bankAcc, aadhar, ifsc, bankingName } = req.body;

  if (!username || !password || !schemeId || !bankAcc || !aadhar || !ifsc || !bankingName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.password !== password) return res.status(401).json({ message: 'Invalid password' });

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });

    if (user.schemes_registered.some(s => s.scheme_id.toString() === schemeId))
      return res.status(400).json({ message: 'User already registered for this scheme' });

    let chitGroup = await ChitGroupRandom.findOne({ scheme_id: schemeId });
    if (!chitGroup) chitGroup = new ChitGroupRandom({ scheme_id: schemeId, slot_ids: [] });

    let slotEntry = chitGroup.slot_ids.find(slot => slot.no_of_seats_left > 0);
    if (!slotEntry) {
      const newSlotId = await getNextSlotId();
      const seatsToUse = Number(scheme.number_of_slots) > 0 ? Number(scheme.number_of_slots) : 10;
      slotEntry = { slot_id: newSlotId, no_of_seats_left: seatsToUse, status: 'active' };
      chitGroup.slot_ids.push(slotEntry);
      await chitGroup.save();
    }

    if (slotEntry.no_of_seats_left <= 0) return res.status(400).json({ message: 'No seats left in this slot' });

    let chitSlot = await ChitSlot.findOne({ scheme_id: schemeId, slot_id: slotEntry.slot_id });
    if (!chitSlot) chitSlot = new ChitSlot({ scheme_id: schemeId, slot_id: slotEntry.slot_id, users: [] });

    if (chitSlot.users.some(u => user._id && u.user_id.toString() === user._id.toString()))
      return res.status(400).json({ message: 'User already registered in this slot' });

    chitSlot.users.push({ user_id: user._id, date_of_joining: new Date() });
    await chitSlot.save();

    // Decrement no_of_seats_left in chitGroup slot entry
    slotEntry.no_of_seats_left -= 1;
    await chitGroup.save();

    user.schemes_registered.push({
      scheme_id: schemeId,
      slot_id: slotEntry.slot_id,
      bid_status: [],
      months_completed: 0,
      has_won_bid: false,
      current_bid_status: false
    });
    await user.save();

    return res.status(200).json({ message: 'Successfully registered for scheme with slot ' + slotEntry.slot_id });
  } catch (error) {
    console.error('Error in randomRegisterForScheme:', error);
    res.status(500).json({ message: 'Internal server error during random registration', error: error.message });
  }
};
