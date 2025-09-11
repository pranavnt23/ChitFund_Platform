  const Auction = require('../models/auction');
  const ChitGroupRandom = require('../models/ChitGroupRandom');
  const SubGroup = require('../models/SubGroup');
  const Group = require('../models/Group');
  const Scheme = require('../models/Scheme');

  // --- Helper: Get scheme's number_of_slots ---
  async function getSchemeSlotsCount(schemeId) {
    const scheme = await Scheme.findById(schemeId);
    return scheme && Number(scheme.number_of_slots) > 0 ? Number(scheme.number_of_slots) : 12;
  }

  async function createAuction(req, res) {
    try {
      const { auction_type, custom_option, random_option, selected_item } = req.body;
      let auction;
      if (auction_type === 'random') {
        if (random_option === 'schemewise') {
          auction = await randomSchemewise(req.body);
        } else if (random_option === 'slotwise') {
          auction = await randomSlotwise({ ...req.body, slot_id: selected_item });
        } else {
          return res.status(400).json({ message: 'Invalid random option' });
        }
      } else if (auction_type === 'custom') {
        if (custom_option === 'groupwise') {
          auction = await customGroupwise({ ...req.body, group_id: selected_item });
        } else if (custom_option === 'subgroupwise') {
          auction = await customSubgroupwise({ ...req.body, subgroup_id: selected_item });
        } else if (custom_option === 'slotwise') {
          auction = await customSlotwise({ ...req.body, slot_id: selected_item });
        } else {
          return res.status(400).json({ message: 'Invalid custom option' });
        }
      } else {
        return res.status(400).json({ message: 'Invalid auction type' });
      }
      res.status(201).json(auction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // --- RANDOM AUCTIONS ---
  async function randomSchemewise(data) {
    const schemeId = data.selected_item;
    const chitGroup = await ChitGroupRandom.findOne({ scheme_id: schemeId });
    if (!chitGroup) throw new Error('Scheme not found in chit_groups_random');
    const schemeDoc = await Scheme.findById(schemeId);
    if (!schemeDoc) throw new Error('Scheme data not found');
    const slotIds = chitGroup.slot_ids || [];
    const results = [];

    for (const slot of slotIds) {
      const slotId = slot.slot_id;
      if (slot.no_of_seats_left > 0) {
        results.push({ slot_id: slotId, status: 'not started', reason: 'seats left in this slot' });
        continue;
      }
      try {
        const auction = await handleAuctionStartAppend(slotId, schemeDoc);
        results.push({ slot_id: slotId, status: 'auction started', auction });
      } catch (error) {
        results.push({ slot_id: slotId, status: 'error', message: error.message });
      }
    }
    return results;
  }

  async function randomSlotwise(data) {
    try {
      const { slot_id } = data;
      const chitGroup = await ChitGroupRandom.findOne({ "slot_ids.slot_id": slot_id });
      if (!chitGroup) throw new Error('No scheme found for this slot');
      const slot = chitGroup.slot_ids.find(s => s.slot_id === slot_id);
      if (!slot) throw new Error('No slot found for this slot_id');
      if (slot.no_of_seats_left > 0) {
        throw new Error('Cannot start auction, seats are still left in this slot');
      }
      const schemeId = chitGroup.scheme_id;
      const schemeDoc = await Scheme.findById(schemeId);
      if (!schemeDoc) throw new Error('Scheme not found');
      const auction = await handleAuctionStartAppend(slot_id, schemeDoc);
      return auction;
    } catch (error) {
      throw error;
    }
  }

  // --- CUSTOM AUCTIONS ---
  async function customGroupwise(data) {
    const { auction_type, custom_option, group_id } = data;
    if (!group_id) throw new Error('group_id is required');
    const group = await Group.findOne({ group_id }).populate('subgroup_ids');
    if (!group) throw new Error('Group not found');
    if (!group.subgroup_ids || group.subgroup_ids.length === 0) throw new Error('No subgroups under this group');
    const results = [];
    for (const subgroup of group.subgroup_ids) {
      try {
        const auctionResult = await customSubgroupwise({
          auction_type,
          custom_option,
          subgroup_id: subgroup.subgroup_id
        });
        results.push({
          subgroup_id: subgroup.subgroup_id,
          subgroup_name: subgroup.subgroup_name,
          status: 'auction result',
          auctionResult
        });
      } catch (error) {
        results.push({
          subgroup_id: subgroup.subgroup_id,
          subgroup_name: subgroup.subgroup_name,
          status: 'error',
          message: error.message
        });
      }
    }
    return {
      group_id,
      auction_type,
      custom_option,
      total_subgroups: results.length,
      results
    };
  }

  async function customSubgroupwise(data) {
    const { auction_type, custom_option, subgroup_id } = data;
    if (!subgroup_id) throw new Error('subgroup_id is required');
    const subgroup = await SubGroup.findOne({ subgroup_id });
    if (!subgroup) throw new Error('Subgroup not found');
    if (!subgroup.schemes_available || subgroup.schemes_available.length === 0) throw new Error('No schemes available under this subgroup');
    for (const schemeEntry of subgroup.schemes_available) {
      if (!schemeEntry.slot_ids || schemeEntry.slot_ids.length === 0) continue;
      for (const slot of schemeEntry.slot_ids) {
        if (slot.no_of_seats_left > 0) {
          throw new Error(`Slot ${slot.slot_id} in this subgroup still has seats left`);
        }
      }
    }
    const results = [];
    for (const schemeEntry of subgroup.schemes_available) {
      if (!schemeEntry.slot_ids || schemeEntry.slot_ids.length === 0) continue;
      const schemeId = schemeEntry.scheme_id;
      const schemeDoc = await Scheme.findById(schemeId);
      if (!schemeDoc) {
        results.push({
          scheme_id: schemeId,
          status: 'error',
          message: 'Scheme document not found'
        });
        continue;
      }
      for (const slot of schemeEntry.slot_ids) {
        try {
          const auction = await handleAuctionStartAppend(slot.slot_id, schemeDoc);
          results.push({
            slot_id: slot.slot_id,
            status: 'auction started',
            auction
          });
        } catch (error) {
          results.push({
            slot_id: slot.slot_id,
            status: 'error',
            message: error.message
          });
        }
      }
    }
    return {
      subgroup_id,
      auction_type,
      custom_option,
      total_slots: results.length,
      results
    };
  }

  async function customSlotwise(data) {
    const { slot_id } = data;
    const subgroup = await SubGroup.findOne({ 'schemes_available.slot_ids.slot_id': slot_id });
    if (!subgroup) throw new Error('Slot not found in any subgroup');
    let slotObj;
    let schemeDoc = null;
    for (const schemeEntry of subgroup.schemes_available) {
      slotObj = schemeEntry.slot_ids.find(s => s.slot_id === slot_id);
      if (slotObj) {
        schemeDoc = await Scheme.findById(schemeEntry.scheme_id);
        break;
      }
    }
    if (!slotObj) throw new Error('Slot not found');
    if (slotObj.no_of_seats_left > 0) throw new Error('Seats are not completely filled for this slot');
    if (!schemeDoc) throw new Error('Scheme not found for this slot');
    return await handleAuctionStartAppend(slot_id, schemeDoc);
  }

  // Shared auction handler for both custom and random auctions with proper conditions
  async function handleAuctionStartAppend(slot_id, scheme) {
    let auction = await Auction.findOne({ slot_id });
    const monthsForAuction = (Number(scheme.number_of_slots) > 0 ? Number(scheme.number_of_slots) - 1 : 11);

    if (!auction) {
      // First-time auction start for this slot
      auction = new Auction({
        auction_status: 'live',
        auction_left_months: monthsForAuction,
        slot_id,
        auction_details: [{ auction_start_timestamp: new Date() }]
      });
      await auction.save();
      return auction;
    } else {
      // Auction exists: only start if not live and months left > 0
      if (auction.auction_status === 'live') {
        throw new Error('Auction is already live for this slot');
      }
      if (auction.auction_left_months <= 0) {
        throw new Error('Auction cannot be started because no months are left');
      }
      auction.auction_status = 'live';
      auction.auction_left_months -= 1;
      auction.auction_details.push({ auction_start_timestamp: new Date() });
      await auction.save();
      return auction;
    }
  }

  module.exports = {
    createAuction,
    randomSchemewise,
    randomSlotwise,
    customGroupwise,
    customSubgroupwise,
    customSlotwise,
    handleAuctionStartAppend
  };
