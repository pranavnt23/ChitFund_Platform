const mongoose = require('mongoose');
const User = require('../models/User');
const Auction = require('../models/Auction');
const Scheme = require('../models/Scheme');

exports.getAuctionsForUseratTop = async (req, res) => {
  try {
    const { id: username } = req.params;
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Extract user's registered slots with current_bid_status
    const registeredSlots = user.schemes_registered.map(sr => ({
      schemeId: sr.scheme_id.toString(),
      slotId: sr.slot_id,
      current_bid_status: sr.current_bid_status === true, // always boolean
    }));
    if (registeredSlots.length === 0) {
      // No registered slots, no live auctions
      return res.status(200).json({ liveAuctions: [] });
    }
    // Extract slot IDs for query
    const slotIds = registeredSlots.map(s => s.slotId);
    // Find auctions with auction_status = 'live' matching user's slots
    const liveAuctions = await Auction.find({
      slot_id: { $in: slotIds },
      auction_status: 'live'
    });
    if (liveAuctions.length === 0) {
      // No live auctions found
      return res.status(200).json({ liveAuctions: [] });
    }
    // Map live auctions by slot_id for quick lookup
    const liveSlotsSet = new Set(liveAuctions.map(a => a.slot_id));
    const schemeIdSet = new Set();
    const liveSchemeInfos = [];
    for (const reg of registeredSlots) {
      if (liveSlotsSet.has(reg.slotId)) {
        // Fetch scheme data if not already fetched
        if (!schemeIdSet.has(reg.schemeId)) {
          const scheme = await Scheme.findById(reg.schemeId);
          if (scheme) {
            liveSchemeInfos.push({
              scheme_id: scheme._id,
              scheme_name: scheme.name,
              icon: scheme.icon || null,
              slot_id: reg.slotId,
              current_bid_status: reg.current_bid_status // pass directly for this slot/scheme
            });
            schemeIdSet.add(reg.schemeId);
          }
        }
      }
    }
    // Return the live scheme infos for this user (no duplicates)
    return res.status(200).json({ liveAuctions: liveSchemeInfos });
  } catch (error) {
    console.error('Error fetching live auctions for user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAuctionForUserAndSchemetoBid = async (req, res) => {
  try {
    const { username, schemeId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(schemeId)) {
      return res.status(400).json({ message: 'Invalid scheme ID format' });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find user's registered slots under the specified scheme
    const userSlots = user.schemes_registered.filter(sr => sr.scheme_id.toString() === schemeId);

    if (userSlots.length === 0) {
      return res.status(404).json({ message: 'User not registered for this scheme' });
    }

    // Check if any registered slot has current_bid_status true
    const hasCurrentBid = userSlots.some(sr => sr.current_bid_status === true);
    if (hasCurrentBid) {
      return res.status(403).json({
        message: 'User already has an active bid. Cannot participate in another bid for this scheme.'
      });
    }

    const slotIds = userSlots.map(sr => sr.slot_id);

    // Find live auctions for these slots
    const liveAuctions = await Auction.findOne({
      slot_id: { $in: slotIds },
      auction_status: 'live'
    });

    if (!liveAuctions) {
      return res.status(404).json({ message: 'No live auctions found for this user and scheme' });
    }

    // Optionally populate scheme name or include partial scheme data
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    // Format response combining auction and scheme info
    const response = {
      scheme_id: scheme._id,
      scheme_name: scheme.name,
      auction_status: liveAuctions.auction_status,
      auction_left_months: liveAuctions.auction_left_months,
      slot_id: liveAuctions.slot_id,
      auction_details: liveAuctions.auction_details
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in getAuctionForUserAndScheme:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.storeBidAmountatSubmit = async (req, res) => {
  try {
    const { username, schemeId, bid_amount } = req.params;

    if (!mongoose.Types.ObjectId.isValid(schemeId)) {
      return res.status(400).json({ message: 'Invalid scheme ID format' });
    }

    const bidAmountNum = Number(bid_amount);
    if (isNaN(bidAmountNum) || bidAmountNum <= 0) {
      return res.status(400).json({ message: 'Invalid bid amount' });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the registered scheme object inside user.schemes_registered
    const schemeReg = user.schemes_registered.find(
      (reg) => reg.scheme_id.toString() === schemeId
    );

    if (!schemeReg) {
      return res.status(404).json({ message: 'User not registered for this scheme' });
    }

    // Increment months_completed by 1
    schemeReg.months_completed = (schemeReg.months_completed || 0) + 1;

    // Set current_bid_status to true and reset any other if needed (optional)
    // If only one scheme can have current_bid_status true, you may reset others here

    schemeReg.current_bid_status = true;

    // Determine new month for bidStatus: last month +1 or 1 if none exist
    let newMonth = 1;
    if (schemeReg.bid_status && schemeReg.bid_status.length > 0) {
      // Get max month from bid_status array
      const months = schemeReg.bid_status.map((b) => b.month);
      newMonth = Math.max(...months) + 1;
    }

    // Create new bid status entry
    const newBidStatus = {
      month: newMonth,
      bid_made: true,
      bid_amount: bidAmountNum,
      timestamp: new Date(),
      payment_made: false,
    };

    // Add new bid status entry
    schemeReg.bid_status.push(newBidStatus);

    // Save updated user document
    await user.save();

    return res.status(200).json({
      message: 'Bid amount stored and user updated successfully',
      scheme_registered: schemeReg,
    });
  } catch (error) {
    console.error('Error in storeBidAmount:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAuctionForUsertoViewHistory = async (req, res) => {
  try {
    const { username, schemeId } = req.params;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find registered scheme matching schemeId
    const registeredScheme = user.schemes_registered.find(sr => {
      const srSchemeId = sr.scheme_id && typeof sr.scheme_id === 'object'
        ? sr.scheme_id._id?.toString() || sr.scheme_id.toString()
        : sr.scheme_id?.toString();
      return srSchemeId === schemeId;
    });

    if (!registeredScheme) {
      return res.status(404).json({ message: 'Scheme not registered by user' });
    }

    // Fetch scheme data
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    // Prepare bid history sorted by month ascending
    const bidHistory = (registeredScheme.bid_status || [])
      .sort((a, b) => a.month - b.month)
      .map(bid => ({
        month: bid.month,
        bid_made: bid.bid_made,
        bid_amount: bid.bid_amount,
        timestamp: bid.timestamp,
        payment_made: bid.payment_made
      }));

    // Current bid amount as highest bid_amount or 0
    const currentBidAmount = bidHistory.length > 0
      ? Math.max(...bidHistory.map(bid => bid.bid_amount))
      : 0;

    // Respond with scheme and auction details
    return res.status(200).json({
      scheme_id: scheme._id,
      scheme_name: scheme.name,
      icon: scheme.icon || null,
      bid_history: bidHistory,
      current_bid_amount: currentBidAmount,
      months_completed: registeredScheme.months_completed,
      has_won_bid: registeredScheme.has_won_bid,
      current_bid_status: registeredScheme.current_bid_status
    });

  } catch (error) {
    console.error('Error fetching auction history for user and scheme:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
