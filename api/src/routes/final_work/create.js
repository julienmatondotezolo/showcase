const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  let { projectname, description, url, images } = req.body;
  let userId = req.user.userid;

  let values = [projectname, description, url, images, userId];
  const newProject = await pool.query(
    "INSERT INTO projects(name, description, url, images, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
    values
  );
  console.log(newProject.rows[0]);
  res.json(newProject.rows[0]);
});

module.exports = router;
