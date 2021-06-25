const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  try {
    let { id } = req.body;

    const allWinners = await pool.query(
      `SELECT projects.name, projects.cluster, projects.winner, projects.projectid from projects where winner = TRUE`
    );

    if (!allWinners.rows.length) {
      const setWinner = await pool.query(
        "UPDATE projects SET superprijs = $1 WHERE projectid = $2",
        [true, id]
      );
      res.sendCustomStatus(400, "Already a winner for this cluster!");
    } else {
      const removeWinner = await pool.query(
        "UPDATE projects SET superprijs = $1 WHERE projectid = $2",
        [false, id]
      );
    }
  } catch (err) {
    console.log(err);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
