const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Example: import your routes here
// const schemeRoutes = require('./routes/schemeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/FundVerse'; // Change DB name as needed

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Scheme Schema (matches your MongoDB document)
const Scheme = mongoose.model('Scheme', new mongoose.Schema({
  name: String,
  description: String,
  target_audience: String,
  investment_plan: {
    monthly_contribution: Number,
    chit_period: Number,
    total_fund_value: [
      {
        duration: Number,
        value: Number
      }
    ]
  },
  benefits: [String],
  icon: String,
  number_of_slots: Number
}));

// User Schema (matches your MongoDB document)
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  fname: String,
  lname: String,
  aadharno: String,
  panno: String,
  asset_doc: {
    file_name: String,
    file_type: String
  },
  email: String,
  phone_number: String,
  password: String,
  dob: Date,
  confirm_password: String,
  registered_schemes: [mongoose.Schema.Types.Mixed] // Accepts ObjectId or string
}));

// --- Search APIs ---

// Search customer by phone, username, or aadhar
app.get('/api/customers', async (req, res) => {
  const { phone, username, aadhar } = req.query;
  let query = {};
  if (phone) query.phone_number = phone;
  if (username) query.username = username;
  if (aadhar) query.aadharno = aadhar;
  try {
    // If no query params, return all users
    const users = Object.keys(query).length === 0
      ? await User.find()
      : await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Search scheme by schemeId or scheme name
app.get('/api/schemes/search', async (req, res) => {
  const { schemeid, schemename } = req.query;
  let query = {};
  if (schemeid) {
    if (mongoose.Types.ObjectId.isValid(schemeid)) {
      query._id = schemeid;
    } else {
      return res.status(400).json({ error: 'Invalid schemeid' });
    }
  }
  if (schemename) query.name = { $regex: schemename, $options: 'i' };
  try {
    const schemes = await Scheme.find(query);

    // Fetch all users once
    const allUsers = await User.find({}).select('username fname lname email phone_number schemes_registered');

    // For each scheme, filter users whose schemes_registered contains the scheme's _id
    const results = schemes.map(scheme => {
      const schemeIdStr = scheme._id.toString();
      const registered_users = allUsers.filter(user =>
        (user.schemes_registered || []).some(
          reg => reg.scheme_id?.toString() === schemeIdStr
        )
      ).map(user => ({
        _id: user._id,
        username: user.username,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phone_number: user.phone_number
      }));

      return { ...scheme.toObject(), registered_users };
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch schemes' });
  }
});

// Get all schemes
app.get('/api/schemes', async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch schemes' });
  }
});

app.post('/api/schemes', async (req, res) => {
  try {
    const scheme = new Scheme(req.body);
    await scheme.save();
    res.status(201).json(scheme);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add scheme', details: err.message });
  }
});

app.delete('/api/schemes/:id', async (req, res) => {
  try {
    await Scheme.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete scheme' });
  }
});

// Update a scheme by ID
app.put('/api/schemes/:id', async (req, res) => {
  try {
    const updated = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Scheme not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update scheme', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});