const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  req.logout();
  res.sendCustomStatus(200, "Succesfully logged out");
  res.redirect('/login');

});

module.exports = router;
