const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  passwordConfirm: {
    type: String,
    required: [true, 'Please confrim your password'],
    // This only work on save!
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
