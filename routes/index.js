const express = require('express');
const router = express.Router();

const signUpController = require('../controllers/signUpController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sign-up', signUpController.signup_get);

router.post('/sign-up', signUpController.signup_post);

router.get('/secret-password', function (req, res, next) {
  res.render('secret-password', { title: 'Secret' });
});

module.exports = router;
