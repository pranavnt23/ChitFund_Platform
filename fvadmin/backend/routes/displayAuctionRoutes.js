const express = require('express');
const router = express.Router();

const displayAuctionController = require('../controllers/displayAuctionController');

// RANDOM auction endpoints
router.get('/random/schemes', displayAuctionController.getRandomSchemes);
router.get('/random/slots', displayAuctionController.getRandomSlots);

// CUSTOM auction endpoints
router.get('/custom/groups', displayAuctionController.getCustomGroups);
router.get('/custom/subgroups', displayAuctionController.getCustomSubgroups);
router.get('/custom/slots', displayAuctionController.getCustomSlots);

module.exports = router;
