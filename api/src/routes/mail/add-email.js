// TO DELETE

const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    try {
      const values = [email];
      const newMail = await pool.query(
        "INSERT INTO emails(email) VALUES($1) RETURNING *",
        values
      );
      console.log(newMail.rows[0]);

      res.json(newMail.rows[0]);
    } catch (err) {
      res.sendCustomStatus(403, "Email already used");
    }
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
