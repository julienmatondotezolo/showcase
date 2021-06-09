const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
    try {
        const allFinalWorksSQL = await pool.query("SELECT * FROM projects");
        res.json(allFinalWorksSQL.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;