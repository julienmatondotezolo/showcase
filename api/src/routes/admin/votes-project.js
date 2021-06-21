const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/:projectid", async (req, res) => {
  const projectId = req.params.projectid;
  try {
    const allVotedProjects = await pool.query(
      ` SELECT  users.username, users.email FROM votes     INNER JOIN users ON votes.user_id = users.userid  AND votes.project_id = ${projectId}`
    );

    res.send(allVotedProjects.rows);
  } catch (err) {
    console.log(err);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
