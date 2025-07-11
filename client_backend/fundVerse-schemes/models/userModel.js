const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  // Add bcrypt for password hashing

// Define the User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], // Email validation
  },
  password: { type: String, required: true },
  registered_schemes: [{
    scheme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' },
    registration_date: { type: Date, default: Date.now }
  }]
}, { timestamps: true }); // Add timestamps

// Password hashing before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Only hash if password is modified
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
  } catch (err) {
    next(err);
  }
});

// Create a model
const User = mongoose.model('User', userSchema);

module.exports = User;
