const { promisify } = require('util');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const User = require('../models/useModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

require('dotenv').config();

// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new AppError('Incorrect email or password', 401));
  }

  // if everything ok, send token to client

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // getting token and check if its there
  if (req.authorization && req.authorization.startsWith('Bearer')) {
    token = req.authorization.split(' ')[1];
    console.log(token);
  }
  if (!token) {
    next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }
  // verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // Check if user still exits
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    next(
      new AppError(
        'The user belonging to this token does no longer exist',
        401,
      ),
    );
  }
  // check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    next(
      new AppError('User recently changed password! Please log in again', 401),
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  // check if user changed passwordafter the token was issued
  next();
});
