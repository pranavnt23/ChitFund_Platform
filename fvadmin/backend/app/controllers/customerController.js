const User = require('./models/User');

exports.searchCustomers = async (req, res) => {
  const { phone, username, aadhar } = req.query;
  let query = {};
  if (phone) query.phone_number = phone;
  if (username) query.username = username;
  if (aadhar) query.aadharno = aadhar;

  try {
    const users = Object.keys(query).length === 0
      ? await User.find()
      : await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};
