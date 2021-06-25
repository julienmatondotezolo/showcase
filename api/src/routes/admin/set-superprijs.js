const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  try {
    let { id } = req.body;

    const allWinners = await pool.query(
      `SELECT projects.name, projects.cluster, projects.winner, projects.projectid from projects where superprijs = TRUE`
    );

    if (!allWinners.rows.length) {
      const setWinner = await pool.query(
        "UPDATE projects SET superprijs = $1 WHERE projectid = $2",
        [true, id]
      );
      res.sendCustomStatus(200, `The project is sucessfully added.`);
    } else {
      if (allWinners.rows[0].projectid == id) {
        const removeWinner = await pool.query(
          "UPDATE projects SET superprijs = $1 WHERE projectid = $2",
          [false, id]
        );
        res.sendCustomStatus(
          200,
          `The project ${allWinners.rows[0].name} is not more Superprijs.`
        );
      } else {
        res.sendCustomStatus(403, "Already a winner for the superprijs!");
      }
    }
  } catch (err) {
    console.log(err);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
