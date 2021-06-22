const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  try {
    const sortParam = req.params.sort;
    console.log(sortParam);
    let sort = sortParam ? sortParam : "ASC";

    const allFinalWorksSQL = await pool.query(`SELECT * from projects`);
    res.status(200).json(allFinalWorksSQL.rows);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});
module.exports = router;
