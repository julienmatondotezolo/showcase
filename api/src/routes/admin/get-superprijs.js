const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  try {
    const allNominatedSuperPrijs = await pool.query(
      `SELECT projects.projectid,  projects.name,projects.cluster, projects.images, users.username, projects.winner FROM superprijs INNER JOIN projects ON superprijs.project_id = projects.projectid INNER JOIN users ON users.userid = projects.user_id ORDER BY project_id ASC`
    );

    res.send(allNominatedSuperPrijs.rows);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});
module.exports = router;
