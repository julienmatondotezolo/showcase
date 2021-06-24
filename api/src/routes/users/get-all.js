const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  try {
    const allUsersSQL = await pool.query("SELECT users.userid, users.email, users.username, users.role FROM users");

    res.status(200).json(allUsersSQL.rows);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
