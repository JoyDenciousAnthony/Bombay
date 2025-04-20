const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  department: String,
  occupation: String,
  gender: String,
  type: String,
  user_name: String,
  password: String,
  id_number:String,
  image: { type: String }, // Base64 string (data:image/jpeg;base64,...)
});

module.exports = mongoose.model('User', UserSchema);
