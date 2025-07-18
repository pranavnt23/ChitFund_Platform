const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const schemeRoutes = require('./routes/schemeRoutes');
const customerRoutes = require('./routes/customerRoutes');
const subGroupRoutes = require('./routes/subGroupRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb://localhost:27017/FundVerse';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/schemes', schemeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/subgroups', subGroupRoutes);  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
