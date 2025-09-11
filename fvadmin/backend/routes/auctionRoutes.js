const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');

router.post('/start', auctionController.createAuction);

module.exports = router;
