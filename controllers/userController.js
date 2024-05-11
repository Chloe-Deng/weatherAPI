const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Update user doc

  res.status(200).json({
    status: 'success',
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

exports.getUser = (req, res) => {
  res.statue(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting user',
    });
  }
};

exports.deleteUsersByLastLogin = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
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
        status: 'fail',
        message: 'No users found with the specified role and date range.',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
      message: 'Students deleted successfully.',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting users',
    });
  }
};

exports.updateUsersRole = async (req, res, next) => {
  const validRoles = ['teacher', 'teacher', 'sensor'];

  try {
    const { startDate, endDate, newRole } = req.query;

    if (!startDate || !endDate || !newRole) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide startDate, endDate, and newRole',
      });
    }

    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid role specified',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid date format',
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
        status: 'not found',
        message:
          'No users found with creation dates within the specified range',
      });
    }

    res.status(200).json({
      status: 'success',
      message: `${result.nModified} users' roles updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};
