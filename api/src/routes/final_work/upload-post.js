const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  const PUBLIC_URL = "http://193.191.183.48:3000/";
  const { originalname, path } = req.file;
  let images = PUBLIC_URL + path.split("/public/").pop();

  let { projectname, description, url, cluster } = req.body;
  let userId = req.user.userid;

  if (check(cluster)) {
    let values = [projectname, description, url, images, cluster, userId];
    try {
      const newProject = await pool.query(
        "INSERT INTO projects(name, description, url, images, cluster, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        values
      );

      res.send("Project succesfully uploaded.");
    } catch (err) {
      console.error(err.message);

      res.sendCustomStatus(500);
    }
  } else {
    res.sendCustomStatus(400);
  }

  function check(cluster) {
    let clusters = ["web", "mobile", "motion", "ar", "digital-making"];

    if (clusters.includes(cluster)) {
      return true;
    }
    return false;
  }
});

module.exports = router;
