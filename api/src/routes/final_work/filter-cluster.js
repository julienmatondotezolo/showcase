const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/:cluster", async (req, res) => {
  try {
    const selectedFinalWork = req.params;

    const allFinalWorksSQL = await pool.query(`SELECT * FROM projects where cluster = '${selectedFinalWork.cluster}'`);
    res.status(200).json(allFinalWorksSQL.rows);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
