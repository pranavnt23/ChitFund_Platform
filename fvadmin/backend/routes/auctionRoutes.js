const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');

router.post('/', auctionController.createAuction);
router.get('/', auctionController.getAllAuctions);
router.get('/:id', auctionController.getAuctionById);

module.exports = router;
