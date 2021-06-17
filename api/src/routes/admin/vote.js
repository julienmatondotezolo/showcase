const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
    return;
  } else {
    if (req.user.role === "student") {
      res.redirect("/login");
      console.log("Not allowed");
      return;
    }
  }

  console.log(req.body)

  let { project_id } = req.body;
  let docentId = req.user.userid;

  let values = [project_id, docentId];

  if (await check()) {
    console.log("CHECKED");
    try {
      const votedProject = await pool.query(
        "INSERT INTO votes(project_id, user_id) VALUES($1, $2) RETURNING *",
        values
      );
      res.sendCustomStatus(200);
    } catch (err) {
      console.error(err.message);
      res.sendCustomStatus(500);
    }
  }

  async function check() {
    try {
      let alreadyVoted = true;
      const allVotedProjects = await pool.query(
        `SELECT votes.user_id, project_id, cluster FROM votes INNER JOIN projects ON votes.project_id = projects.projectid AND votes.user_id = ${docentId}`
      );
      if (allVotedProjects.rows.length >= 5) {
        // Already 5 votes
        console.log("Already 5 votes");
        res.sendCustomStatus(400, "Already 5 votes");
        alreadyVoted = false;
        return false;
      }
      const wantedVoteProject = await pool.query(
        `SELECT cluster FROM projects where projectid = ${project_id}`
      );
      const projectToVoteCluster = wantedVoteProject.rows[0].cluster;

      // Look if docent already voted to the cluster from wanted vote project
      allVotedProjects.rows.forEach((alreadyVotedProject) => {
        console.log(alreadyVotedProject);
        if (alreadyVotedProject.cluster == projectToVoteCluster) {
          console.log("Already voted for the cluster " + projectToVoteCluster);
          res.sendCustomStatus(400, "Already voted for this cluster.");
          alreadyVoted = false;
          return false;
        }
      });

      if (alreadyVoted) {
        return true;
      }
    } catch (err) {
      res.sendCustomStatus(500);
      return false;
    }
  }
});

module.exports = router;
