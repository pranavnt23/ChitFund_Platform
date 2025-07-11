require('dotenv').config();
const mongoose = require('mongoose');
const Scheme = require('./models/schemeModel'); // Adjust the path if necessary

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Function to modify an existing scheme
const modifyScheme = async (schemeId, updatedData) => {
  try {
    const result = await Scheme.findByIdAndUpdate(schemeId, updatedData, { new: true });
    if (result) {
      console.log('Scheme modified successfully:', result);
    } else {
      console.log('Scheme not found.');
    }
  } catch (error) {
    console.error('Error modifying scheme:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Sample scheme ID and updated data
const schemeId = 'YOUR_SCHEME_ID_HERE'; // Replace with actual scheme ID
const updatedData = {
  name: "Updated Investment Scheme",
  description: "Updated description of the scheme."
};

// Call the function to modify the scheme
modifyScheme(schemeId, updatedData);
