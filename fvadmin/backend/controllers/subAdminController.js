const SubAdmin = require('../models/SubAdmin');

// Get all subadmins
exports.getAllSubAdmins = async (req, res) => {
  try {
    const subAdmins = await SubAdmin.find();
    res.json(subAdmins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subadmins', error });
  }
};

// Get subadmin by username
exports.getSubAdminByUsername = async (req, res) => {
  const username = req.params.username;
  try {
    const subAdmin = await SubAdmin.findOne({ username });
    if (!subAdmin) {
      return res.status(404).json({ message: 'SubAdmin not found' });
    }
    res.json(subAdmin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subadmin', error });
  }
};

// Create a new subadmin
exports.createSubAdmin = async (req, res) => {
  try {
    const { 
      username, 
      password, 
      fname, 
      lname, 
      email, 
      phone_number, 
      group_ids,
      valid_till, 
      status 
    } = req.body;

    const existing = await SubAdmin.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newSubAdmin = new SubAdmin({
      username,
      password,
      fname,
      lname,
      email,
      phone_number,
      group_ids,
      valid_till,
      status: status || 'active'
    });

    const savedSubAdmin = await newSubAdmin.save();
    res.status(201).json(savedSubAdmin);
  } catch (error) {
    console.error('Error creating subadmin:', error);
    res.status(500).json({ message: 'Error creating subadmin', error });
  }
};

// Update subadmin by ID
exports.updateSubAdmin = async (req, res) => {
  try {
    const updatedSubAdmin = await SubAdmin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSubAdmin) {
      return res.status(404).json({ message: 'SubAdmin not found' });
    }

    res.json(updatedSubAdmin);
  } catch (error) {
    console.error('Error updating subadmin:', error);
    res.status(500).json({ message: 'Error updating subadmin', error });
  }
};

// Delete subadmin by ID
exports.deleteSubAdmin = async (req, res) => {
  try {
    const deletedSubAdmin = await SubAdmin.findByIdAndDelete(req.params.id);

    if (!deletedSubAdmin) {
      return res.status(404).json({ message: 'SubAdmin not found' });
    }

    res.json({ message: 'SubAdmin deleted successfully' });
  } catch (error) {
    console.error('Error deleting subadmin:', error);
    res.status(500).json({ message: 'Error deleting subadmin', error });
  }
};
