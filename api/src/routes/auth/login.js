const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/", async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    // failureRedirect: res.sendCustomStatus(401),
    failureFlash: false,
  })(req, res, next);
});
module.exports = router;
