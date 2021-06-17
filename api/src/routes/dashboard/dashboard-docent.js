const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.isAuthenticated()) {
    // || (req.user.role == "student") (redirect if student and allow if docent)
    res.redirect("/login");
    return;
  }

  /*   if (req.user.role == "admin") { */

  res.render("index.ejs", {
    username: req.user.username,
  });
});

module.exports = router;
