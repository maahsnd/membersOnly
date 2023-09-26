const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const signUpController = require('../controllers/signUpController');
const User = require('../models/User');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

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
