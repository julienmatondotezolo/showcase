const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const passport = require("passport");

router.post("/", async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/logged-in',
        failureRedirect: '/error',
        failureFlash: false,
    })(req, res, next);

});
module.exports = router;