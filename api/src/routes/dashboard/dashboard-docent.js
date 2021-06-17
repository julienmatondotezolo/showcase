const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("index.ejs", {
    username: req.user.username,
  });
});

module.exports = router;
