// app/middleware/adminAuth.js
const SubAdmin = require('../models/SubAdmin');

const adminAuth = async (req, res, next) => {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res.status(401).json({ message: 'Authentication required in headers' });
  }

  try {
    const admin = await SubAdmin.findOne({ username });

    if (!admin || admin.password !== password) {  // Replace with bcrypt if hashed
      return res.status(403).json({ message: 'Invalid admin credentials' });
    }

    // You can attach admin info to the request object if needed
    req.admin = admin;
    next();
  } catch (err) {
    console.error('Admin auth error:', err);
    res.status(500).json({ message: 'Server error during admin authentication' });
  }
};

module.exports = adminAuth;
