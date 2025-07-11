const mongoose = require('mongoose');
const User = require('./models/userModel');
const Scheme = require('./models/schemeModel');
require('dotenv').config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Register a user for a scheme
const registerUserForScheme = async (username, schemeId) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error('User not found');
    }

    const scheme = await Scheme.findById(schemeId);

    if (!scheme) {
      throw new Error('Scheme not found');
    }

    // Check if the user is already registered for the scheme
    if (user.registered_schemes.some(item => item.scheme_id.toString() === schemeId)) {
      throw new Error('User is already registered for this scheme');
    }

    // Register the user for the scheme
    user.registered_schemes.push({ scheme_id: schemeId });
    await user.save();

    console.log(`User ${username} registered successfully for scheme ${scheme.name}`);
  } catch (error) {
    console.error('Error registering user for scheme:', error.message);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};

// Example usage
registerUserForScheme('john_doe', 'scheme_id_here'); // Replace 'scheme_id_here' with an actual scheme ID
