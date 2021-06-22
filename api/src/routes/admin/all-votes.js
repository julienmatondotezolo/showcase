const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  try {
    const allVotedProjects = await pool.query(
      `SELECT votes.id, projects.name,projects.cluster, projects.images,   users.username FROM votes INNER JOIN projects ON votes.project_id = projects.projectid INNER JOIN users ON votes.user_id = users.userid ORDER BY project_id ASC`
    );

    let object = {};

    allVotedProjects.rows.forEach((item) => {
      object[item.name] = object[item.name] ? object[item.name] + 1 : 1;
    });

    allVotedProjects.rows.forEach((item) => {
      item.totalVotes = object[item["name"]];
    });

    res.send(allVotedProjects.rows);
    
  } catch (err) {
    console.log(err);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
