const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  console.log(req.body);

  let { id } = req.body;
  let docentId = req.user.userid;

  let values = [id, docentId];

  console.log(values);

  let alreadyVotedCluster = false;
  let alreadyVotedClusterId = 0;

  const allVotedProjects = await pool.query(
    `SELECT votes.id, votes.user_id, project_id, name, cluster FROM votes INNER JOIN projects ON votes.project_id = projects.projectid AND votes.user_id = ${docentId}`
  );

  const wantedVoteProject = await pool.query(
    `SELECT cluster FROM projects where projectid = ${id}`
  );
  const projectToVoteCluster = wantedVoteProject.rows[0].cluster;

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
      res.sendCustomStatus(200, `You have successfully unvoted for ${wantedVoteProject.rows[0].name}`);
    } catch (err) {
      console.log(err);
      res.sendCustomStatus(500);
      return false;
    }
  } else {
    return true;
  }
});

module.exports = router;
