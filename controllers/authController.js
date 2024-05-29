const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    // Make sure that cookie cannot be accessed or modified in any way by browser, to prevent cross site scripting attack
    httpOnly: true,
  };

  // A cookie is a small piece of text sent by server
  // A browser automatically stores a cookie that it receives and sends it back in all future request to that server where it came from
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    // Create a new document on model
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      lastLoggedIn: req.body.lastLoggedIn,
    });

    createSendToken(newUser, 201, req, res);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error: ' + messages.join('. '),
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'User email already existed.',
      });
    }

    res.status(500).json({
      status: 'fail',
      message: 'An error occurred: ' + err.message,
    });
  }
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 3 * 1000),
      httpOnly: true,
    });
    // We have to return this function, otherwise it will send an error response to the client
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email: email }).select('+password');
  // const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 3 * 1000),
      httpOnly: true,
    });
    return next(new AppError('Incorrect email or password', 401));
  }

  user.lastLoggedIn = new Date();
  await user.save({ validateBeforeSave: false });

  // 3) If everything is ok, send token to client
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // expire after 10 seconds
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// exports.createUser = async (req, res) => {
//   try {
//     // Ensure that only teachers can specify user roles, otherwise set the default role.
//     const role = req.user.role === 'teacher' ? req.body.role : 'user';

//     const newUser = await User.create({
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//       passwordConfirm: req.body.passwordConfirm,
//       role: role, // User roles are assigned by the administrator or set as defaults
//     });

//     newUser.password = undefined; // Do not send the password to user

//     res.status(201).json({
//       status: 'success',
//       data: {
//         user: newUser,
//       },
//     });
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       const messages = Object.values(err.errors).map((val) => val.message);
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Validation error: ' + messages.join('. '),
//       });
//     }
//     res.status(500).json({
//       status: 'fail',
//       message: 'An error occurred: ' + err.message,
//     });
//   }
// };

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  // We can not define a variable inside if block, const and let are block scope
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === 'loggedout') {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belongs to the token does not exist', 401)
    );
  }

  // 4) Check is user changed password after the JWT token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // If there's no problem in any of above steps, and next will be called, which will get access to the route that was protected
  req.user = currentUser;
  next();
});

// Authorization middleware function
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'teacher'], role='user'

    // get a role from the currentUser from the previous (protect) middleware
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
