const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  try {
    const sortParam = req.params.sort;
    console.log(sortParam);

    /*     const allFinalWorksSQL = await pool.query(
      `SELECT projects.name, projects.description, projects.cluster,  projects.images, projects.url from projects`
    );

    let nominations = allFinalWorksSQL.rows;

    let object = {
      motion: [],
      web: [],
      ar: [],
      mobile: [],
      "digital-making": [],
    };

    nominations.forEach((element) => {
      element.isWinner = false;
      object[element.cluster].push(element);
    });

    object["motion"][0].isWinner = true;
    object["web"][0].isWinner = true;
    object["ar"][0].isWinner = true;
    object["mobile"][0].isWinner = true;
    object["digital-making"][0].isWinner = true;

    res.status(200).json(object); */

    const allVotedProjects = await pool.query(
      `SELECT votes.id, projects.name,projects.cluster, projects.images, users.username FROM votes INNER JOIN projects ON votes.project_id = projects.projectid INNER JOIN users ON votes.user_id = users.userid ORDER BY project_id ASC`
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
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});
module.exports = router;
