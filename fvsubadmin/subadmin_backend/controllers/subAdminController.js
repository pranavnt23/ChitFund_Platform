const SubAdmin = require('../models/SubAdmin');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await SubAdmin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    if (admin.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({ message: 'Login successful', username: admin.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
