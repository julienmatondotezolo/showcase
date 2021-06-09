const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.delete("/", async (req, res) => {
    res.send('delete-fw route!');
});

module.exports = router;