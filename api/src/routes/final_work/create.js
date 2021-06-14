const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const status = require("../status/status");

router.post("/", async (req, res) => {
  let { projectname, description, url, images, cluster } = req.body;
  let userId = req.user.userid;

  let values = [projectname, description, url, images, cluster, userId];

  if (check(cluster)) {
    try {
      const newProject = await pool.query(
        "INSERT INTO projects(name, description, url, images, cluster, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        values
      );
      res
        .status(200)
        .send(
          `The project "${newProject.rows[0].name}" is created! Code: ${res.statusCode}`
        );

        res.sendCustomStatus(200);
    } catch (err) {
      console.error(err.message);
      res.sendCustomStatus(500);
    }
  } else {
      res.sendCustomStatus(400);
  }

  function check(cluster) {
    let clusters = [
      "Web",
      "Digital Making",
      "Motion Graphics",
      "Mobile Appliance",
    ];

    if (clusters.includes(cluster)) {
      return true;
    }
    return false;
  }
});

module.exports = router;
