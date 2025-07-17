const express = require('express');
const router = express.Router();
const subAdminController = require('../controllers/subadminController');

router.post('/login', subAdminController.login);

module.exports = router;
