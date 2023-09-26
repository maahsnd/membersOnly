const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/User.js');

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
    .custom(async (req) => {
      const email = await User.find({ email: req.body.email });
      if (email) {
        throw new Error('E-mail already in use');
      }
    })
    .trim()
    .escape(),
  body(
    'password',
    'Password must be min 8 characters, contain a lower case, upper case, number, and special character.'
  )
    .trim()
    .custom((req) => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
      if (passwordRegex.test(req.body.password)) {
        return true;
      }
      return false;
    }),
  body('confirm_password', 'Passwords do not match')
    .trim()
    .custom((req) => {
      return req.body.password === req.body.confirm_password;
    }),

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
        errors: errors
      });
      return;
    } else {
      await user.save();
      res.redirect('/secret-password');
    }
  })
];
