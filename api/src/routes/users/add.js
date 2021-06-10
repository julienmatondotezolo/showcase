const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
    try {
        const {
            email,
            password,
            username,
        } = req.body;

        const values = [
            email,
            password,
            username,
        ]
        const newUser = await pool.query(
            'INSERT INTO users(email, password, username) VALUES($1, $2, $3) RETURNING *'
            , values)
        console.log(newUser.rows[0])

        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;