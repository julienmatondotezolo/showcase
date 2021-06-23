const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  console.log(req.body);

  let { id } = req.body;
  let docentId = req.user.userid;

  let values = [id, docentId];

  console.log(values);
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
      let alreadyVotedCluster = false;
      let alreadyVotedClusterId = 0;

      const allVotedProjects = await pool.query(
        `SELECT votes.id, votes.user_id, project_id, cluster FROM votes INNER JOIN projects ON votes.project_id = projects.projectid AND votes.user_id = ${docentId}`
      );

      if (allVotedProjects.rows.length >= 5) {
        // Already 5 votes
        console.log("Already 5 votes");
        res.sendCustomStatus(400, "Already 5 votes");
        alreadyVoted = false;
        return false;
      }

      const wantedVoteProject = await pool.query(
        `SELECT cluster FROM projects where projectid = ${id}`
      );
      const projectToVoteCluster = wantedVoteProject.rows[0].cluster;

      // Look if docent already voted to the cluster from wanted vote project
      allVotedProjects.rows.forEach((alreadyVotedProject) => {
        if (alreadyVotedProject.cluster == projectToVoteCluster) {
          alreadyVotedCluster = true;
          alreadyVotedClusterId = alreadyVotedProject.id;
          console.log("Already voted for the cluster " + projectToVoteCluster);
          res.sendCustomStatus(403, `Already voted for the cluster ${projectToVoteCluster}`);
          return false;
        }
      });

      if (alreadyVotedCluster) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.log(err);
      res.sendCustomStatus(500);
      return false;
    }
  }
});

module.exports = router;
