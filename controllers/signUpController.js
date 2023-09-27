const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.login_get = asyncHandler(async (req, res, next) => {
  res.render('log-in', { title: 'Log-in' });
});

exports.login_post = asyncHandler(async (req, res, next) => {
  console.log('export');
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in'
  })(req, res, next);
});

exports.user_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  res.render('user', { title: 'User Dashboard', user: user });
});

exports.signup_get = asyncHandler(async (req, res, next) => {
  res.render('sign-up', { title: 'Sign-up form' });
});

exports.signup_post = [
  body('first_name', 'First name required, max length 30')
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body('family_name', 'Family name required, max length 30')
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body('email', 'Email required, must be in format: name@site.com')
    .isEmail()
    .trim()
    .custom(async (value) => {
      const email = await User.find({ email: value });
      if (email) {
        return false;
      } else {
        return true;
      }
    })
    .withMessage('E-mail already in use')
    .escape(),
  body('password')
    .trim()
    .custom((value) => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
      if (passwordRegex.test(value)) {
        return true;
      }
      return false;
    })
    .withMessage(
      'Password must be min 8 characters, contain a lower case, upper case, number, and special character.'
    ),
  body('confirm_password')
    .trim()
    .custom((value, { req }) => {
      return req.body.password === value;
    })
    .withMessage('Passwords do not match'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      email: req.body.email,
      password: req.body.password
    });

    if (!errors.isEmpty()) {
      res.render('sign-up', {
        title: 'Sign-up form',
        userinfo: user,
        errors: errors.array()
      });
      return;
    } else {
      bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
        user.password = hashedPassword;
        await user.save();
      });
      res.redirect(`/log-in`);
    }
  })
];

exports.secret_get = asyncHandler(async (req, res, next) => {
  res.render('secret-password', { title: 'Secret' });
});

exports.secret_post = asyncHandler(async (req, res, next) => {
  if (process.env.SECRETPASSWORD === req.body.secret_password) {
    const user = await User.findById(req.params.id);
    user.membership_status = true;
    await User.findByIdAndUpdate(user._id, user, {});
    res.redirect(`/${user._id}/admin`);
  } else {
    res.render('secret-password', {
      title: 'Secret',
      error: "That's not the secret :("
    });
  }
});

exports.admin_get = asyncHandler(async (req, res, next) => {
  res.render('admin', { title: 'Admin sign up' });
});

exports.admin_post = asyncHandler(async (req, res, next) => {
  if (process.env.ADMINPIN === req.body.admin_pin) {
    const user = await User.findById(req.params.id);
    user.admin = true;
    await User.findByIdAndUpdate(user._id, user, {});
    res.redirect('/');
  } else {
    res.render('admin', {
      title: 'Admin sign up',
      error: 'Incorrect pin'
    });
  }
});
