const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  try {
    let userid = req.user.userid;

    const selectedProjectsSQL = await pool.query(
      `SELECT * FROM projects where user_id = $1`,
      [userid]
    );

    res.status(200).json(selectedProjectsSQL.rows);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
