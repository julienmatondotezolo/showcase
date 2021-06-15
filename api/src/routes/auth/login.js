const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/", async (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.log("Internal server error");
      return next(err);
    }
    if (!user) {
      console.log("ERROR: ", info.message);
      return res.json(`ERROR: ${info.message}`);
      // return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      user.sessionid = req.sessionID
      console.log(`${user.email} logged in succesfully.`);
      return res.send(user);
    });
  })(req, res, next);
});
module.exports = router;
