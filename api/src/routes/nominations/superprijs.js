const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("superprijs.ejs", {
    username: req.user.username,
  });
});

module.exports = router;
