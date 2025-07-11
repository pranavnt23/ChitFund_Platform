const User = require('../models/User');

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).send('Invalid username or password');
    }

    req.session.userId = user._id;
    res.json({ message: 'User logged in successfully', isLoggedIn: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server error');
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.send('User logged out successfully');
  });
};

exports.checkLoginStatus = (req, res) => {
  res.json({ isLoggedIn: !!req.session.userId });
};
