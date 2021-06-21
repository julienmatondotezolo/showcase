const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  console.log(req.body);

  let { project_id } = req.body;
  let docentId = req.user.userid;

  let values = [project_id, docentId];

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

      const wantedVoteProject = await pool.query(
        `SELECT cluster FROM projects where projectid = ${project_id}`
      );
      const projectToVoteCluster = wantedVoteProject.rows[0].cluster;

      // Look if docent already voted to the cluster from wanted vote project
      allVotedProjects.rows.forEach((alreadyVotedProject) => {
        if (alreadyVotedProject.cluster == projectToVoteCluster) {
          alreadyVotedCluster = true;
          alreadyVotedClusterId = alreadyVotedProject.id;
          console.log("Already voted for the cluster " + projectToVoteCluster);
        }
      });

      if (alreadyVotedCluster) {
        try {
          const deleteVotedProject = await pool.query(
            "DELETE FROM votes WHERE id = $1",
            [alreadyVotedClusterId]
          );
        } catch (err) {
          res.sendCustomStatus(500);
          return false;
        }
        return true;
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
