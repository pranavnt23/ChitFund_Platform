const express = require('express');
const router = express.Router();
const subGroupController = require('../controllers/subGroupController');

router.post('/add', subGroupController.createSubGroup);
router.get('/all', subGroupController.getAllSubGroups);
router.get('/by-username/:username', subGroupController.getSubGroupsByUsername);
router.put('/update/:id', subGroupController.updateSubGroup);
router.delete('/delete/:id', subGroupController.deleteSubGroup);

module.exports = router;
