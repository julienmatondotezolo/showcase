const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  req.logout();
  res.redirect("/login");
  console.log("you have succesfully logged");
});
module.exports = router;
