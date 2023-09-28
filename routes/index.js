const express = require('express');
const router = express.Router();
const signUpController = require('../controllers/signUpController');
const messageController = require('../controllers/messageController');
const Message = require('../models/Message');
const asyncHandler = require('express-async-handler');

/* GET home page. */
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const message_list = await Message.find({})
      .populate('author')
      .sort({ time_stamp: 1 })
      .exec();
    res.render('index', {
      title: 'Home',
      user: req.user,
      message_list: message_list
    });
  })
);

router.get('/sign-up', signUpController.signup_get);

router.post('/sign-up', signUpController.signup_post);

router.get('/:id/secret-password', signUpController.secret_get);

router.post('/:id/secret-password', signUpController.secret_post);

router.get('/:id/admin', signUpController.admin_get);

router.post('/:id/admin', signUpController.admin_post);

router.get('/:id/user-page', signUpController.user_get);

router.get('/log-in', signUpController.login_get);

router.post('/log-in', signUpController.login_post);

router.get('/log-out', signUpController.logout_get);

router.get('/new-message', messageController.message_get);

router.post('/new-message', messageController.message_post);

router.get('/delete-message/:id', messageController.delete_get);

router.post('/delete-message/:id', messageController.delete_post);

module.exports = router;
