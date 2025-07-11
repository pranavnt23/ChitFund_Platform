require('dotenv').config();
const mongoose = require('mongoose');
const Scheme = require('./models/schemeModel'); // Adjust the path if necessary

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Function to remove a scheme
const removeScheme = async (schemeId) => {
  try {
    const result = await Scheme.findByIdAndDelete(schemeId);
    if (result) {
      console.log('Scheme removed successfully.');
    } else {
      console.log('Scheme not found.');
    }
  } catch (error) {
    console.error('Error removing scheme:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Sample scheme ID to remove
const schemeId = 'YOUR_SCHEME_ID_HERE'; // Replace with actual scheme ID

// Call the function to remove the scheme
removeScheme(schemeId);
