const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ensureAuthenticated } = require("./auth");

router.post("/", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/upload",
    failureRedirect: "/login/error",
    failureFlash: req.flash("error_msg"),
  })(req, res, next);
});

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("upload");
    return;
  }

  console.log("GET ROUTE LOGIN");
  res.render("login.ejs");
});

router.get("/error", (req, res) => {
  res.sendCustomStatus(400);
});
module.exports = router;
