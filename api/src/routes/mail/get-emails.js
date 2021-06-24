const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
    try {
        const emails = await pool.query(
            `SELECT * FROM EMAILS`
        );
        res.send(emails.rows);
    } catch (err) {
        console.log(err);
        res.sendCustomStatus(500);
    }
});

module.exports = router;
