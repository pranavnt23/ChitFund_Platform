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

// Update Group slot with nested subgroups, schemes, and slots
exports.updateGroupSlot = async (req, res) => {
  try {
    const { groupId } = req.params;
    const incomingData = req.body;

    // Step 1: Fetch full current group with populated subgroups
    const group = await Group.findOne({ group_id: groupId }).populate('subgroup_ids');
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Step 2: Update basic group fields only if changed
    if (incomingData.group_name && incomingData.group_name !== group.group_name) {
      group.group_name = incomingData.group_name;
      await group.save();
    }
    if (incomingData.group_password && incomingData.group_password !== group.group_password) {
      group.group_password = incomingData.group_password;
      await group.save();
    }

    // Step 3: Process incoming subgroups array if present
    if (Array.isArray(incomingData.subgroups)) {
      for (const sgIncoming of incomingData.subgroups) {
        // Check if the subgroup already exists by subgroup_id
        let subgroup = group.subgroup_ids.find(sg => sg.subgroup_id === sgIncoming.subgroup_id);

        if (!subgroup) {
          // Subgroup does not exist: create new, save, add reference to group
          const newSubGroup = new SubGroup({
            subgroup_id: sgIncoming.subgroup_id || `SG${Date.now()}`,
            subgroup_name: sgIncoming.subgroup_name || '',
            schemes_available: [],
          });
          await newSubGroup.save();

          group.subgroup_ids.push(newSubGroup._id);
          await group.save();

          subgroup = newSubGroup;
        } else {
          // Subgroup exists, update subgroup_name only if changed
          if (sgIncoming.subgroup_name && sgIncoming.subgroup_name !== subgroup.subgroup_name) {
            subgroup.subgroup_name = sgIncoming.subgroup_name;
            await subgroup.save();
          }
        }

        // Step 4: Process schemes inside the subgroup if any incoming
        if (Array.isArray(sgIncoming.schemes_available)) {
          // Load full subgroup from DB fresh to get latest schemes_available
          const dbSubgroup = await SubGroup.findById(subgroup._id);
          for (const schIncoming of sgIncoming.schemes_available) {
            // Check if scheme already exists by scheme_id
            let scheme = dbSubgroup.schemes_available.find(s => s.scheme_id === schIncoming.scheme_id);

            if (!scheme) {
              // Scheme doesn't exist yet: create new scheme object and add slots

              const newSlots = [];
              for (const slotIncoming of schIncoming.slot_ids || []) {
                const newSlotId = slotIncoming.slot_id || await getNextSlotId();
                // Create chit slot doc
                const chitSlot = new ChitSlot({
                  subgroup_id: dbSubgroup._id,
                  slot_id: newSlotId,
                  users: [],
                });
                await chitSlot.save();

                newSlots.push({
                  slot_id: newSlotId,
                  no_of_seats_left: slotIncoming.no_of_seats_left ?? 10,
                });
              }

              dbSubgroup.schemes_available.push({
                scheme_id: schIncoming.scheme_id,
                slot_ids: newSlots,
              });

              await dbSubgroup.save();
            } else {
              // Scheme exists; append only genuinely new slots

              // Gather existing slot_ids for easy lookup
              const existingSlotIds = scheme.slot_ids.map(sl => sl.slot_id);

              for (const slotIncoming of schIncoming.slot_ids || []) {
                // Slot exists if slot_id matches existing slot_ids AND not empty string
                const slotExists = slotIncoming.slot_id && existingSlotIds.includes(slotIncoming.slot_id);

                if (!slotExists) {
                  // New slot: generate slot id if needed, create doc and append
                  const newSlotId = slotIncoming.slot_id || await getNextSlotId();
                  const chitSlot = new ChitSlot({
                    subgroup_id: dbSubgroup._id,
                    slot_id: newSlotId,
                    users: [],
                  });
                  await chitSlot.save();

                  scheme.slot_ids.push({
                    slot_id: newSlotId,
                    no_of_seats_left: slotIncoming.no_of_seats_left ?? 10,
                  });
                }
              }

              // Save subgroup only once after processing all slots
              await dbSubgroup.save();
            }
          }
        }
      }
    }

    // All updates done, return success with updated group
    const updatedGroup = await Group.findOne({ group_id: groupId }).populate('subgroup_ids');
    return res.json({ message: "Group updated incrementally and appended successfully", data: updatedGroup });

  } catch (error) {
    console.error("Error in precise updateGroupSlot:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    // Remove from subgroups' schemes_available.slot_ids arrays
    await SubGroup.updateMany(
      { "schemes_available.slot_ids.slot_id": slotId },
      { $pull: { "schemes_available.$[].slot_ids": { slot_id: slotId } } }
    );

    // Delete the slot itself
    await ChitSlot.deleteOne({ slot_id: slotId });

    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    console.error("Error in deleteSlot:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteSubGroup = async (req, res) => {
  try {
    const { subgroupId } = req.params;
    const subGroup = await SubGroup.findOne({ subgroup_id: subgroupId });
    if (!subGroup) return res.status(404).json({ message: "Subgroup not found" });

    // Delete associated chitslots
    for (const scheme of subGroup.schemes_available) {
      const slotIds = scheme.slot_ids.map(slotObj => slotObj.slot_id);
      await ChitSlot.deleteMany({ slot_id: { $in: slotIds } });
    }

    // Remove from any group.subgroup_ids arrays
    await Group.updateMany(
      { subgroup_ids: subGroup._id },
      { $pull: { subgroup_ids: subGroup._id } }
    );

    // Remove from SubAdmin (if referenced)
    await SubAdmin.updateMany(
      { subgroup_ids: subGroup._id },
      { $pull: { subgroup_ids: subGroup._id } }
    );

    // Delete the subgroup itself
    await SubGroup.deleteOne({ _id: subGroup._id });

    res.json({ message: "Subgroup and related slots deleted successfully" });
  } catch (err) {
    console.error("Error in deleteSubGroup:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteGroupSlot = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Find the group (using correct key)
    const group = await Group.findOne({ group_id: groupId }).populate('subgroup_ids');
    if (!group) return res.status(404).json({ message: "Group not found" });

    // For each subgroup, clean up chitslots
    for (const subgroup of group.subgroup_ids) {
      for (const scheme of subgroup.schemes_available) {
        const slotIds = scheme.slot_ids.map(slotObj => slotObj.slot_id); // S001, S002, etc.
        await ChitSlot.deleteMany({ slot_id: { $in: slotIds }});
      }
      // Remove the subgroup itself
      await SubGroup.deleteOne({ _id: subgroup._id });
    }

    // Remove group from subAdmins
    await SubAdmin.updateMany(
      { group_ids: group._id },
      { $pull: { group_ids: group._id } }
    );

    // Remove the group itself
    await Group.deleteOne({ _id: group._id });

    res.json({ message: "Group and all associated subgroups and slots deleted successfully" });
  } catch (err) {
    console.error("Error in deleteGroupSlot:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
