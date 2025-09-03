const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');

// Public routes
router.get('/', schemeController.getAllSchemes);
router.get('/:id', schemeController.getSchemeById);

//router.post('/register', schemeController.registerForScheme);
// Authenticated user routes with separate registration endpoints
router.post('/customregister', schemeController.customRegisterForScheme);
router.post('/randomregister', schemeController.randomRegisterForScheme);

module.exports = router;
