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

// Controller method for customRegisterForScheme
exports.customRegisterForScheme = async (req, res) => {
  const {
    username,
    password,
    schemeId,
    bankAcc,
    aadhar,
    ifsc,
    bankingName,
    subgroupId, // string - from input: subgroup_id field in SubGroup model
    slotId      // string - slot_id expected under subgroup's schemes_available slot_ids
  } = req.body;

  // Validate required fields
  if (!username || !password || !schemeId || !bankAcc || !aadhar || !ifsc || !bankingName || !subgroupId || !slotId) {
    return res.status(400).json({ message: 'All fields including subgroupId and slotId are required' });
  }

  try {
    // Verify username and password from User collection
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Assuming password is stored hashed, use a password compare function (bcrypt or similar)
    // For simplicity, if plaintext stored:
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Verify SubGroup existence & validity of subgroupId
    const subgroup = await SubGroup.findOne({ subgroup_id: subgroupId });
    if (!subgroup) {
      return res.status(404).json({ message: 'SubGroup not found' });
    }

    // Check if schemeId is present in subgroup.schemes_available
    const schemeEntry = subgroup.schemes_available.find(
      s => s.scheme_id.toString() === schemeId
    );
    if (!schemeEntry) {
      return res.status(400).json({ message: 'Scheme not available under this subgroup' });
    }

    // Check if slotId is present under schemeEntry.slot_ids
    const slotEntry = schemeEntry.slot_ids.find(
      slot => slot.slot_id === slotId
    );
    if (!slotEntry) {
      return res.status(400).json({ message: 'Slot ID not found under this scheme in subgroup' });
    }

    // Check if seats available
    if (slotEntry.no_of_seats_left <= 0) {
      return res.status(400).json({ message: 'No seats left in this slot' });
    }

    // Check if user already registered for this scheme
    const alreadyRegistered = user.schemes_registered.some(s => s.scheme_id.toString() === schemeId);
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'User already registered for this scheme' });
    }

    // Add user_id and date_of_joining to chitSlot collection for the subgroup and slot
    // Find existing chitSlot document or create new
    let chitSlot = await ChitSlot.findOne({ subgroup_id: subgroup._id, slot_id: slotId });

    if (!chitSlot) {
      chitSlot = new ChitSlot({
        subgroup_id: subgroup._id,
        slot_id: slotId,
        users: []
      });
    }

    // Check if user already in chitSlot users (avoid duplicates)
    const userInSlot = chitSlot.users.find(u => u.user_id.toString() === user._id.toString());
    if (userInSlot) {
      return res.status(400).json({ message: 'User already registered in this slot' });
    }

    chitSlot.users.push({ user_id: user._id, date_of_joining: new Date() });
    await chitSlot.save();

    // Decrement no_of_seats_left in subgroup slot
    slotEntry.no_of_seats_left -= 1;
    await subgroup.save();

    // Optional: Also, add scheme registration info to user as before
    user.schemes_registered.push({
      scheme_id: schemeId,
      bid_status: [],
      months_completed: 0,
      bids_made_count: 0,
      has_won_bid: false
    });

    await user.save();

    return res.status(200).json({ message: 'Successfully registered with custom slot' });

  } catch (error) {
    console.error('Error in customRegisterForScheme:', error);
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
};

// Utility function to get next slot id
async function getNextSlotId() {
  try {
    const lastSlot = await ChitSlot.findOne({}, { slot_id: 1 })
      .sort({ slot_id: -1 })
      .limit(1);
    if (!lastSlot || !lastSlot.slot_id) {
      return 'S001';
    }
    const numPart = parseInt(lastSlot.slot_id.slice(1));
    const nextNum = numPart + 1;
    return `S${String(nextNum).padStart(3, '0')}`;
  } catch (error) {
    console.error("Error getting next slot ID:", error);
    return 'S001';
  }
}

// Helper to find a subgroup with available seats for a scheme
async function findSubgroupWithAvailableSeats(schemeId) {
  const subgroup = await SubGroup.findOne({
    "schemes_available.scheme_id": new mongoose.Types.ObjectId(schemeId),
    "schemes_available.slot_ids.no_of_seats_left": { $gt: 0 }
  });

  if (!subgroup) return null;

  const schemeEntry = subgroup.schemes_available.find(s => s.scheme_id.toString() === schemeId.toString());
  if (!schemeEntry) return null;

  const slotEntry = schemeEntry.slot_ids.find(slot => slot.no_of_seats_left > 0);

  if (!slotEntry) return null;

  return { subgroup, schemeEntry, slotEntry };
}

exports.randomRegisterForScheme = async (req, res) => {
  const {
    username,
    password,
    schemeId,
    bankAcc,
    aadhar,
    ifsc,
    bankingName,
  } = req.body;

  if (!username || !password || !schemeId || !bankAcc || !aadhar || !ifsc || !bankingName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Validate user and password
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.password !== password) return res.status(401).json({ message: 'Invalid password' });

    // Validate scheme
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });

    // Check if user already registered to scheme
    if (user.schemes_registered.some(s => s.scheme_id.toString() === schemeId)) {
      return res.status(400).json({ message: 'User already registered for this scheme' });
    }

    // Check or create chit_groups_random doc for this scheme
    let chitGroup = await ChitGroupRandom.findOne({ scheme_id: schemeId });
    if (!chitGroup) {
      chitGroup = new ChitGroupRandom({
        scheme_id: schemeId,
        slot_ids: []
      });
    }

    // Try to find subgroup slot with available seats
    let found = await findSubgroupWithAvailableSeats(schemeId);
    let subgroup, slotEntry;

    if (found) {
      ({ subgroup, slotEntry } = found);
    } else {
      // Create new slot with next slot_id
      const newSlotId = await getNextSlotId();

      // Find or create a subgroup with this scheme
      subgroup = await SubGroup.findOne({ "schemes_available.scheme_id": schemeId });
      if (!subgroup) {
        const subgroupCount = await SubGroup.countDocuments();
        const newSubgroupId = `SG${String(subgroupCount + 1).padStart(3, '0')}`;
        subgroup = new SubGroup({
          subgroup_id: newSubgroupId,
          subgroup_name: `SubGroup ${newSubgroupId}`,
          schemes_available: [{
            scheme_id: schemeId,
            slot_ids: []
          }]
        });
      }

      // Find or add scheme entry in subgroup
      let schemeAvailable = subgroup.schemes_available.find(s => s.scheme_id.toString() === schemeId.toString());
      if (!schemeAvailable) {
        schemeAvailable = {
          scheme_id: schemeId,
          slot_ids: []
        };
        subgroup.schemes_available.push(schemeAvailable);
      }

      // Add new slot with 10 seats left
      schemeAvailable.slot_ids.push({
        slot_id: newSlotId,
        no_of_seats_left: 10
      });

      await subgroup.save();

      slotEntry = {
        slot_id: newSlotId,
        no_of_seats_left: 10
      };
    }

    // Find or create chitSlot doc for the slot
    let chitSlot = await ChitSlot.findOne({ subgroup_id: subgroup._id, slot_id: slotEntry.slot_id });
    if (!chitSlot) {
      chitSlot = new ChitSlot({
        subgroup_id: subgroup._id,
        slot_id: slotEntry.slot_id,
        users: []
      });
    }

    // Prevent duplicate user in chitSlot
    if (chitSlot.users.some(u => u.user_id.toString() === user._id.toString())) {
      return res.status(400).json({ message: 'User already registered in this slot' });
    }

    chitSlot.users.push({ user_id: user._id, date_of_joining: new Date() });
    await chitSlot.save();

    // Decrement seat count if available
    if (slotEntry.no_of_seats_left > 0) {
      const schemeAvailable = subgroup.schemes_available.find(s => s.scheme_id.toString() === schemeId.toString());
      const slotToUpdate = schemeAvailable.slot_ids.find(s => s.slot_id === slotEntry.slot_id);
      slotToUpdate.no_of_seats_left -= 1;
      await subgroup.save();
    }

    // Register scheme for user
    user.schemes_registered.push({
      scheme_id: schemeId,
      bid_status: [],
      months_completed: 0,
      bids_made_count: 0,
      has_won_bid: false
    });
    await user.save();

    // Update chitGroup slot_ids
    if (!chitGroup.slot_ids.some(s => s.slot_id === slotEntry.slot_id)) {
      chitGroup.slot_ids.push({ slot_id: slotEntry.slot_id, status: 'active' });
      await chitGroup.save();
    }

    return res.status(200).json({ message: 'Successfully registered for the scheme with random slot!' });
  } catch (error) {
    console.error('Error in randomRegisterForScheme:', error);
    return res.status(500).json({ message: 'Internal server error during random registration', error: error.message });
  }
};