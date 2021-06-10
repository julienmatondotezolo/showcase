const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
    try {
        const allUsersSQL = await pool.query("SELECT * FROM users");
        res.json(allUsersSQL.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;