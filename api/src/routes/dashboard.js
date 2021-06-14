const express = require("express");
const router = express.Router();

router.get("/:user", async (req, res) => {
  let user = req.params.user;
  console.log(user);
  console.log("heee");

  res.send({
    userId: user.userid,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
  });
});

module.exports = router;
