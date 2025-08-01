require('dotenv').config(); // Load .env variables at the very top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const subAdminRoutes = require('./routes/subadminRoutes');

const app = express();

// Use PORT from .env, fallback to 5000
const PORT = process.env.PORT || 5000;

// Use Mongo URI from .env
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB atlas connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/subadmin', subAdminRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
