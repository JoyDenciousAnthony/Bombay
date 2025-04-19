const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  department: String,
  occupation: String,
  gender: String,
  type: String,
  user_name: String,
  password: String,
  attan: { type: Array, default: [] },
  image: {
    data: String,       // base64 string
    content: String,    // like image/png
  },
});

module.exports = mongoose.model('User', userSchema);
