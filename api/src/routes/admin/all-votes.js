const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  try {
    const allVotedProjects = await pool.query(
      ` SELECT votes.id, votes.project_id, votes.user_id, projects.name, users.username, users.email FROM votes    INNER JOIN projects ON votes.project_id = projects.projectid   INNER JOIN users ON votes.user_id = users.userid ORDER BY project_id ASC`
    );

    res.send(allVotedProjects.rows);
  } catch (err) {
    console.log(err);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
