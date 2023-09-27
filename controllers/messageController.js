const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');

exports.message_get = asyncHandler(async (req, res, next) => {
  if (req.user) {
    res.render('new-message');
  } else res.redirect('/log-in');
});

exports.message_post = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title required')
    .escape(),
  body('message')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message required, max length 1000')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      author: req.user
    });
    console.log('message' + message);
    if (!errors.isEmpty()) {
      res.render('new-message', {
        title: 'Create new message',
        message: message,
        errors: errors.array()
      });
      return;
    } else {
      await message.save();
      res.redirect('/');
    }
  })
];
