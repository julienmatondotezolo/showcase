const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
    req.logout();
    res.redirect('/logged-out');
});

module.exports = router;