const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Fetch registered schemes for a user
const fetchRegisteredSchemes = async (username) => {
  try {
    const user = await User.findOne({ username }).populate('registered_schemes.scheme_id');

    if (!user) {
      throw new Error('User not found');
    }

    console.log(`Registered schemes for ${username}:`);
    user.registered_schemes.forEach(item => {
      console.log(`- ${item.scheme_id.name}: ${item.registration_date}`);
    });
  } catch (error) {
    console.error('Error fetching registered schemes:', error.message);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};

// Example usage
fetchRegisteredSchemes('john_doe'); // Replace 'john_doe' with an actual username
