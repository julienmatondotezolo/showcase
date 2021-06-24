const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  try {
    let docentId = req.user.userid;
    const allVotedProjects = await pool.query(
      `SELECT
      projects.name,
      projects.projectid,
      projects.images,
      projects.cluster,
      users.username,
      projects.url,
      nominations.points
      FROM
      nominations
      INNER JOIN projects ON projects.projectid = nominations.project_id
      AND nominations.user_id = ${docentId}
      INNER JOIN users ON users.userid = projects.user_id ORDER BY points DESC `
    );

    res.send(allVotedProjects.rows);
  } catch (err) {
    res.sendCustomStatus(500);
  }
});

module.exports = router;
