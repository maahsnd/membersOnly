const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
      res.redirect(`/${user._id}/secret-password`);
    }
  })
];

exports.secret_get = asyncHandler(async (req, res, next) => {
  res.render('secret-password', { title: 'Secret' });
});

exports.secret_post = asyncHandler(async (req, res, next) => {
  if (process.env.SECRETPASSWORD === req.body.secret_password) {
    const user = User.findByIdAndUpdate(req.body.id);
    user.membership_status = true;
    await User.findByIdAndUpdate(req.body.id, user, {});
    res.redirect('/');
  } else {
    res.render('secret-password', {
      title: 'Secret',
      Error: "That's not the secret :("
    });
  }
});
