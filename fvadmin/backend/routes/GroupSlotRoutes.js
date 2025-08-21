const express = require('express');
const router = express.Router();
const GroupSlotController = require('../controllers/GroupSlotController');

router.post('/register', GroupSlotController.registerGroupSlot);
router.get('/all', GroupSlotController.getAllGroupSlots);
router.get('/:groupId', GroupSlotController.getGroupSlotById);
router.put('/update/:groupId', GroupSlotController.updateGroupSlot);
router.delete('/delete/group/:groupId', GroupSlotController.deleteGroupSlot);
router.delete('/delete/subgroup/:subgroupId', GroupSlotController.deleteSubGroup);
router.delete('/delete/slot/:slotId', GroupSlotController.deleteSlot);


module.exports = router;
