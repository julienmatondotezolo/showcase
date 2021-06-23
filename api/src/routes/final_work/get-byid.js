const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/:id", async (req, res) => {
  try {
    const selectedFinalWork = req.params;
    console.log(selectedFinalWork);
    const selectedFinalWorkSQL = await pool.query(
      `SELECT projects.name, projects.cluster, projects.description, projects.images, projects.url, projects.projectid, users.username, users.email FROM projects INNER JOIN users on projects.user_id = users.userid and projectid = '${selectedFinalWork.id}'`
    );

    res.status(200).json(selectedFinalWorkSQL.rows);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
