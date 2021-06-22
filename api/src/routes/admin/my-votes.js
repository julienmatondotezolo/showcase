const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  let docentId = req.user.userid;

  try {
    const allVotedProjects = await pool.query(
      `SELECT
      projects.name,
      projects.projectid,
      projects.images,
      projects.cluster,
      users.username
  FROM
      votes
      INNER JOIN projects ON projects.projectid = votes.project_id
      AND votes.user_id = ${docentId}
      INNER JOIN users ON users.userid = projects.user_id `
    );

    res.send(allVotedProjects.rows);
  } catch (err) {
    res.sendCustomStatus(500);
  }
  
});

module.exports = router;
