const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
    res.send('update-fw route!');
});

module.exports = router;