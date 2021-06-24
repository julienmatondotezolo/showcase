const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  console.log(req.body);

  let { id } = req.body;
  let docentId = req.user.userid;

  let values = [id, docentId];

  console.log(values);

  let alreadyNominatedCluster = false;
  let alreadyNominatedClusterId = 0;

  const allNominatedProjects = await pool.query(
    `SELECT nominations.id, nominations.user_id, project_id, name, cluster FROM nominations INNER JOIN projects ON nominations.project_id = projects.projectid AND nominations.user_id = ${docentId}`
  );

  const wantedNominatedProject = await pool.query(
    `SELECT cluster, name FROM projects where projectid = ${id}`
  );
  const projectToVoteCluster = wantedNominatedProject.rows[0].cluster;

  allNominatedProjects.rows.forEach((alreadyNominatedProject) => {
    if (alreadyNominatedProject.cluster == projectToVoteCluster) {
      alreadyNominatedCluster = true;
      alreadyNominatedClusterId = alreadyNominatedProject.id;
      console.log("Already voted for the cluster " + projectToVoteCluster);
    }
  });

  if (alreadyNominatedCluster) {
    try {
      const deleteNominatedroject = await pool.query(
        "DELETE FROM nominations WHERE id = $1",
        [alreadyNominatedClusterId]
      );
      res.sendCustomStatus(200, `You have successfully unvoted for ${wantedNominatedProject.rows[0].name}`);
    } catch (err) {
      console.log(err);
      res.sendCustomStatus(404);
      return false;
    }
  } else {
    return true;
  }
});

module.exports = router;
