// Middleware to check if a user is authenticated via session
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next(); // Proceed to route handler
  } else {
    return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
  }
};

module.exports = isAuthenticated;
