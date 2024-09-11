const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name should be provided'],
  },
  email: {
    type: String,
    required: [true, 'An email should be provided'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A password should be provided'],
    minLength: 8,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
