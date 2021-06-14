const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  console.log(req.body)
  console.log(req.user)
  res.send({
    userId: req.user.userid,
    email: req.user.email,
    username: req.user.username,
    avatar: req.user.avatar,
  });
});

module.exports = router;
