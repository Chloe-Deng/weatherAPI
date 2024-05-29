const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const mongoose = require('mongoose');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    // formatting the json to Jsend
    status: 'success',
    results: users.length,
    data: {
      users,
      // in ES6, if the key and value have the same name, we can write users
    },
  });
});

exports.createUser = async (req, res) => {
  try {
    // Ensure that only teachers can specify user roles, otherwise set the default role.
    const role = req.user.role === 'teacher' ? req.body.role : 'user';

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: role, // User roles are assigned by the administrator or set as defaults
    });

    newUser.password = undefined; // Do not send the password to user

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        status: 400,
        message: 'Validation error: ' + messages.join('. '),
      });
    } else if (err.code && err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        status: 400,
        message: `Duplicate key error: ${field} already exists.`,
      });
    }
    res.status(500).json({
      status: 500,
      message: 'Internal server error occurred!',
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 200,
      message: 'Updated successfully',
      data: {
        user,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        status: 400,
        message: `Validation error: ${messages.join('. ')}`,
      });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({
        status: 400,
        message: 'Invalid user ID format',
      });
    }

    if (err.code && err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        status: 400,
        message: `Duplicate key error: ${field} already exists.`,
      });
    }

    console.error('Error during user update:', err);
    res.status(500).json({
      status: 500,
      message: 'An error occurred during the update.',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid ID format',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User data not found.',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: 'An error occurred during deleting user!',
    });
  }
};

exports.deleteUsersByLastLogin = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid date format for startDate or endDate.',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);

    const currentUserId = req.user._id;
    // console.log(currentUserId);

    const result = await User.deleteMany({
      role: 'student',
      lastLoggedIn: { $gte: start, $lte: end },
      _id: { $ne: currentUserId },
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: `No users found with 'student' role and last login dates within the specified range.`,
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error occurred!',
    });
  }
};

exports.updateUsersRole = async (req, res) => {
  const validRoles = ['teacher', 'student', 'sensor'];

  try {
    const { startDate, endDate, newRole } = req.query;

    if (!startDate || !endDate || !newRole) {
      return res.status(400).json({
        status: 400,
        message: 'Please provide startDate, endDate, and newRole.',
      });
    }

    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid role specified.',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid date format.',
      });
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const result = await User.updateMany(
      {
        createdAt: { $gte: start, $lte: end },
      },
      {
        $set: { role: newRole },
      }
    );

    if (result.nModified === 0) {
      return res.status(404).json({
        status: 404,
        message:
          'No users found with creation dates within the specified range.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: `${result.nModified} users' roles updated successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'An error occurred during the update!',
    });
  }
};
