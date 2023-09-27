const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const signUpController = require('../controllers/signUpController');
const User = require('../models/User');
const Message = require('../models/Message');
const asyncHandler = require('express-async-handler');

/* GET home page. */
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const message_list = await Message.find({}).sort({ time_stamp: 1 }).exec();
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

router.get('/log-in', function (req, res, next) {
  res.render('log-in', { title: 'Log in' });
});

router.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in'
  })
);

router.get('/new-message', function (req, res, next) {
  res.render('new-message');
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({
        username: username
      });
      if (!user) {
        return devNull(null, false, { message: 'Incorrect username' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = router;
