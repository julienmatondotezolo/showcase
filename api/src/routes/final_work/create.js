const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const status = require("../status/status");

router.post("/", async (req, res) => {
  console.log(req.body)
  let {
    projectname,
    description,
    url,
    images,
    cluster
  } = req.body;
  // let userId = req.user.userid;
  let userId = req.body.userId;

  let values = [projectname, description, url, images, cluster, userId];

  if (check(cluster)) {
    try {
      const newProject = await pool.query(
        "INSERT INTO projects(name, description, url, images, cluster, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        values
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
      "web",
      "mobile",
      "motion",
      "ar",
      "digital-making",
    ];

    if (clusters.includes(cluster)) {
      console.log("Cluster present")
      return true;
    }
    console.log("Cluster not present")
    return false;
  }
});

module.exports = router;