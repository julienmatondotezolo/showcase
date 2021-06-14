const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.delete("/:id", async (req, res) => {
  res.send("delete-user route!");
  const { id } = req.params;

  try {
    const selectedUserSQL = await pool.query(
      "SELECT * FROM users where projectid = $1",
      [id]
    ); // Search the project that you want to delete

    if (selectedUserSQL.rows[0]?.userid == id) {
      // TODO:  // Check for admin rights
      const deleteUser = await pool.query("DELETE FROM users WHERE id = $1", [
        id,
      ]);

      res
        .status(200)
        .send(
          `The user "${selectedUserSQL.rows[0].name}" with id ${id} is deleted! Code: ${res.statusCode} `
        );
    }
  } catch (err) {
    res.sendCustomStatus(400);
  }
});

module.exports = router;
