const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/:username", async (req, res) => {
    try {
        const selectedUser = req.params;
        console.log(selectedUser);
        const selectedUserSQL = await pool.query(`SELECT * FROM users where username = '${selectedUser.username}'`);
        res.json(selectedUserSQL.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;