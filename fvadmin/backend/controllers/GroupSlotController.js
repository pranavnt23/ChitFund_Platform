const SubAdmin = require('../models/SubAdmin');
const Group = require('../models/Group');
const SubGroup = require('../models/SubGroup');
const ChitSlot = require('../models/ChitSlot');

// Utility function to generate next ID
function generateNextId(prefix, lastId) {
  if (!lastId) return `${prefix}001`;
  const num = parseInt(lastId.slice(prefix.length)) + 1;
  return prefix + String(num).padStart(3, '0');
}

// Function to get the next unique slot ID
async function getNextSlotId() {
  try {
    // Find the slot with the highest slot_id
    const lastSlot = await ChitSlot.findOne({}, { slot_id: 1 })
      .sort({ slot_id: -1 })
      .limit(1);
    
    if (!lastSlot || !lastSlot.slot_id) {
      return 'S001';
    }
    
    // Extract the numeric part and increment
    const numPart = parseInt(lastSlot.slot_id.slice(1));
    const nextNum = numPart + 1;
    return `S${String(nextNum).padStart(3, '0')}`;
  } catch (error) {
    console.error("Error getting next slot ID:", error);
    return 'S001'; // fallback
  }
}

// Register Group Slot
exports.registerGroupSlot = async (req, res) => {
  try {
    const { subAdmin, groupName, password, numSubgroups, subgroups } = req.body;

    // validate SubAdmin
    const subAdminDoc = await SubAdmin.findOne({ username: subAdmin });
    if (!subAdminDoc) {
      return res.status(400).json({ error: "Invalid SubAdmin username" });
    }

    // generate group_id (G001 style)
    const groupCount = await Group.countDocuments();
    const groupId = `G${String(groupCount + 1).padStart(3, "0")}`;

    // create group
    const group = new Group({
      group_id: groupId,
      group_name: groupName,
      group_password: password,
      subgroup_ids: []
    });
    await group.save();

    // push group into subAdmin
    subAdminDoc.group_ids.push(group._id);
    await subAdminDoc.save();

    // Get the starting slot ID for consecutive numbering
    let currentSlotId = await getNextSlotId();

    // loop through subgroups
    for (let i = 0; i < numSubgroups; i++) {
      const sg = subgroups[i];

      // generate subgroup id
      const subgroupCount = await SubGroup.countDocuments();
      const subgroupId = `SG${String(subgroupCount + 1).padStart(3, "0")}`;

      const subGroup = new SubGroup({
        subgroup_id: subgroupId,
        subgroup_name: sg.name,
        schemes_available: []
      });

      // for each scheme under subgroup
      for (let scheme of sg.schemes) {
        const slotObjects = [];

        for (let j = 0; j < scheme.slots; j++) {
          // create chit slot with unique consecutive slot ID
          const chitSlot = new ChitSlot({
            subgroup_id: subGroup._id,
            slot_id: currentSlotId,
            users: []
          });
          await chitSlot.save();

          // push slot reference in subgroup with default 10 seats
          slotObjects.push({
            slot_id: currentSlotId,
            no_of_seats_left: 10
          });

          // increment slot ID for next slot
          const numPart = parseInt(currentSlotId.slice(1));
          currentSlotId = `S${String(numPart + 1).padStart(3, '0')}`;
        }

        subGroup.schemes_available.push({
          scheme_id: scheme.schemeId,
          slot_ids: slotObjects
        });
      }

      await subGroup.save();

      // add subgroup ref to group
      group.subgroup_ids.push(subGroup._id);
    }

    await group.save();

    return res.status(201).json({
      message: "GroupSlot registered successfully",
      groupId: groupId
    });

  } catch (error) {
    console.error("❌ Error in registerGroupSlot:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

exports.getAllGroupSlots = async (req, res) => {
  try {
    // Fetch all groups with populated subgroups
    const groups = await Group.find().populate({
      path: 'subgroup_ids',
      model: 'SubGroup'
    });

    const result = [];

    for (const group of groups) {
      // Find the subadmin for this group
      const subAdmin = await SubAdmin.findOne({ group_ids: group._id });
      
      // Get all chitslots for this group's subgroups
      const subgroupIds = group.subgroup_ids.map(sg => sg._id);
      const chitSlots = await ChitSlot.find({ subgroup_id: { $in: subgroupIds } });

      // Structure the response
      const groupData = {
        group_id: group.group_id,
        group_name: group.group_name,
        group_password: group.group_password,
        subadmin_name: subAdmin ? subAdmin.username : null,
        subgroups: group.subgroup_ids.map(subgroup => ({
          subgroup_id: subgroup.subgroup_id,
          subgroup_name: subgroup.subgroup_name,
          schemes_available: subgroup.schemes_available,
          chitslots: chitSlots.filter(slot => slot.subgroup_id.toString() === subgroup._id.toString())
        })),
        total_chitslots: chitSlots.length,
        all_chitslots: chitSlots
      };

      result.push(groupData);
    }

    res.json(result);
  } catch (err) {
    console.error("Error in getAllGroupSlots:", err);
    res.status(500).json({ message: 'Server Error', details: err.message });
  }
};

exports.getGroupSlotById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findOne({ groupId });
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateGroupSlot = async (req, res) => {
  try {
    const { groupId } = req.params;
    const updatedData = req.body;
    const updatedGroup = await Group.findOneAndUpdate({ groupId }, updatedData, { new: true });
    if (!updatedGroup) return res.status(404).json({ message: 'Group not found' });
    res.json({ message: 'Group updated successfully', data: updatedGroup });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteGroupSlot = async (req, res) => {
  try {
    const { groupId } = req.params;
    await Group.deleteOne({ groupId });
    await SubGroup.deleteMany({ groupId });
    await ChitSlot.deleteMany({ groupId });
    res.json({ message: 'Group slot deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};