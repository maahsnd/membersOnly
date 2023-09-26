const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.signup_get = asyncHandler(async (req, res, next) => {
  res.render('sign-up', { title: 'Sign-up form' });
});
