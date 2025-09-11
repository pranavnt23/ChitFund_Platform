require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const schemeRoutes = require('./routes/schemeRoutes');
const customerRoutes = require('./routes/customerRoutes');
const subAdminRoutes = require('./routes/subAdminRoutes');
const groupSlotRoutes = require('./routes/GroupSlotRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const dispauctionRoutes=require('./routes/displayAuctionRoutes');

const app = express();

// Use PORT from .env or fallback to 5000
const PORT = process.env.PORT || 5000;

// Use MongoDB URI from .env
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected to Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/schemes', schemeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/subadmins', subAdminRoutes);
app.use('/api/groupslot', groupSlotRoutes);
app.use('/api/auction', auctionRoutes);
app.use('/api/dispauction', dispauctionRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
