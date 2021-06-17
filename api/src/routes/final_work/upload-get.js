const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
    return;
  }

  res.render("project.ejs", {
    username: req.user.username,
  });
});

module.exports = router;
