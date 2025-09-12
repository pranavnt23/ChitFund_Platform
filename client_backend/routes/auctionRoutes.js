const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');

router.get('/getauction/:id',auctionController.getAuctionsForUseratTop)
router.get('/user-auction/:username/:schemeId', auctionController.getAuctionForUserAndSchemetoBid);
router.get('/user-auction/:username/:schemeId/:bid_amount', auctionController.storeBidAmountatSubmit);
router.get('/user-auction-history/:username/:schemeId', auctionController.getAuctionForUsertoViewHistory);

module.exports = router;
