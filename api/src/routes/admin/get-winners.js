const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
    try {

        const winners = await pool.query(
            `SELECT * FROM PROJECTS WHERE PROJECTS.WINNER = TRUE`
        );
        res.send(winners.rows);
    } catch (err) {
        console.log(err);
        res.sendCustomStatus(500);
    }
});

module.exports = router;
