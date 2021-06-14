const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/", async (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.log("here");
      return next(err);
    }
    if (!user) {
      console.log("here2");
      return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      console.log(user);
      return res.send(user);
    });
  })(req, res, next);
});
module.exports = router;
