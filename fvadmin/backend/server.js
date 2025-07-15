const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const schemeRoutes = require('./app/routes/schemeRoutes');
const customerRoutes = require('./app/routes/customerRoutes');

// Import Middleware
const adminAuth = require('./app/middleware/adminAuth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/FundVerse';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Apply adminAuth before these routes
app.use('/api/schemes', adminAuth, schemeRoutes);
app.use('/api/customers', adminAuth, customerRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
