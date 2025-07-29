const express = require('express');
const router = express.Router();
const GroupSlotController = require('../controllers/GroupSlotController');

router.post('/register', GroupSlotController.registerGroupSlot);
router.get('/all', GroupSlotController.getAllGroupSlots);
router.get('/:groupId', GroupSlotController.getGroupSlotById);
router.put('/update/:groupId', GroupSlotController.updateGroupSlot);
router.delete('/delete/:groupId', GroupSlotController.deleteGroupSlot);

module.exports = router;
