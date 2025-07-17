const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const subAdminRoutes = require('./routes/subadminRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/FundVerse', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/subadmin', subAdminRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
