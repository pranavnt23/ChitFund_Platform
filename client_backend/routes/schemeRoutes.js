const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');

// Public routes
router.get('/', schemeController.getAllSchemes);
router.get('/:id', schemeController.getSchemeById);

// Authenticated user routes
router.post('/register', schemeController.registerForScheme);

module.exports = router;
