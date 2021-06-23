const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  try {
    const sortParam = req.params.sort;
    console.log(sortParam);

    const allFinalWorksSQL = await pool.query(
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

    res.status(200).json(object);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});
module.exports = router;
