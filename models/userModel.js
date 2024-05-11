const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'sensor'],
      default: 'teacher',
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password are not the same!',
      },
    },
    lastLoggedIn: {
      type: Date,
      default: Date.now, 
    },

    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Pre save middleware: runs between the password received and about to save into the database
userSchema.pre('save', async function (next) {
  // this points to the current user document
  // Only encrypt password when user modify the password (update or create a new one)
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Compare the password that user passes in the body and the password in the database

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); // boolean
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // In an instance method, this keyword points to current doc
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
    // 100 < 200 True means changed
    // 300 < 200 False means not changed
  }

  // False means user has not changed his password after the token was issued
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// const user = {
//   name: 'Josh',
//   email: 'student4@email.com',
//   password: 'pass1234',
//   passwordConfirm: 'pass1234',
//   role: 'student',
// };
// fetch('http://localhost:3001/api/v1/users', {
//   method: 'POST',
//   headers: {
//     'Content-type': 'application/json',
//   },
//   body: JSON.stringify(user),
// })
//   .then((res) => res.json())
//   .then((data) => console.log(data));

const user = {
  email: 'teacher1@email.com',
  password: 'pass1234',
};
fetch('http://localhost:3001/api/v1/users/login', {
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
  },
  body: JSON.stringify(user),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
