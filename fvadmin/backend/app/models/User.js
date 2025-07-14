const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  registered_schemes: [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model('User', userSchema);
