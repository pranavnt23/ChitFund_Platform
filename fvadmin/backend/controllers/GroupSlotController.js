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

exports.registerGroupSlot = async (req, res) => {
  try {
    const { subadminUsername, groupName, groupPassword, subGroups } = req.body;

    const subAdmin = await SubAdmin.findOne({ username: subadminUsername });
    if (!subAdmin) return res.status(404).json({ message: 'SubAdmin not found' });

    const lastGroup = await Group.findOne().sort({ groupId: -1 });
    const newGroupId = generateNextId('G', lastGroup ? lastGroup.groupId : null);

    const group = new Group({
      groupId: newGroupId,
      groupName,
      password: groupPassword,
      subAdminUsername: subadminUsername
    });
    await group.save();

    for (let i = 0; i < subGroups.length; i++) {
      const sg = subGroups[i];

      const lastSubGroup = await SubGroup.findOne().sort({ subgroupId: -1 });
      const newSubGroupId = generateNextId('SG', lastSubGroup ? lastSubGroup.subgroupId : null);

      const subGroup = new SubGroup({
        subgroupId: newSubGroupId,
        groupId: newGroupId,
        subgroupName: sg.subgroupName
      });
      await subGroup.save();

      for (let j = 0; j < sg.schemes.length; j++) {
        const schemeName = sg.schemes[j];

        const lastSlot = await ChitSlot.findOne().sort({ slotId: -1 });
        const newSlotId = generateNextId('S', lastSlot ? lastSlot.slotId : null);

        const chitSlot = new ChitSlot({
          slotId: newSlotId,
          groupId: newGroupId,
          subgroupId: newSubGroupId,
          schemeName
        });
        await chitSlot.save();
      }
    }

    return res.status(201).json({ message: 'GroupSlot registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllGroupSlots = async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
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
