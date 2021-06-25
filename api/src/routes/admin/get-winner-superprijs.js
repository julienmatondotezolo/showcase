const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  try {
    const superprijswinner = await pool.query(
      `SELECT * FROM PROJECTS WHERE PROJECTS.SUPERPRIJS = TRUE`
    );
    res.send(superprijswinner.rows);
  } catch (err) {
    console.log(err);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
