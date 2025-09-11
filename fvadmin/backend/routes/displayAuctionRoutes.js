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

// Route to get all auction details, sorted by newest first
router.get('/auctions', displayAuctionController.getAuctions);

module.exports = router;
