const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  try {
    let { id } = req.body;

    const projectToWin = await pool.query(
      `SELECT projects.name, projects.cluster, projects.winner, projects.projectid from projects where projectid = ${id}`
    );

    const allWinners = await pool.query(
      `SELECT projects.name, projects.cluster, projects.winner, projects.projectid from projects where winner = TRUE`
    );

    canVote = true;
    toRemove = false;

    allWinners.rows.forEach((element) => {
      if (projectToWin.rows[0].cluster == element.cluster) {
        canVote = false;
        if (projectToWin.rows[0].projectid == element.projectid) {
          toRemove = true;
        }
      }
    });

    if (!canVote && !toRemove) {
      res.sendCustomStatus(400, "Already a winner for this cluster!");
    }

    if (toRemove) {
      const removeWinner = await pool.query(
        "UPDATE projects SET winner = $1 WHERE projectid = $2",
        [false, id]
      );

      res.sendCustomStatus(
        200,
        `${projectToWin.rows[0].name} is removed from the winners!`
      );
    }
    if (canVote) {
      const setWinner = await pool.query(
        "UPDATE projects SET winner = $1 WHERE projectid = $2",
        [true, id]
      );
      res.sendCustomStatus(
        200,
        `${projectToWin.rows[0].name} is the winner of the cluster ${projectToWin.rows[0].cluster}!`
      );
    }
    console.log(allWinners.rows);
  } catch (err) {
    console.log(err);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
