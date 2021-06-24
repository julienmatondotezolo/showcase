const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/:userid", async (req, res) => {
  try {
    const selectedUser = req.params;
    console.log(selectedUser);
    const selectedUserSQL = await pool.query(
      `SELECT users.userid, users.email, users.username, users.role FROM users where userid = '${selectedUser.userid}'`
    );

    res.status(200).json(selectedUserSQL.rows);
  } catch (err) {
    console.error(err.message);

    res.sendCustomStatus(500);
  }
});

module.exports = router;
