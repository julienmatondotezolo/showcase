const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ensureAuthenticated } = require("./auth");

router.post('/', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: req.flash('error_msg'),
  })(req, res, next);
});


router.get('/', (req, res) => {
  var message = req.flash('message')
  console.log('you are trying to get login');
  res.render('login.ejs',{ message });
})
module.exports = router;
