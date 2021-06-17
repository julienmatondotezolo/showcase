const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const selectedProjectSQL = await pool.query(
      "SELECT * FROM projects where projectid = $1",
      [id]
    ); // Search the project that you want to delete

    // Check to see if the project that you want to delete is yours (you can't delete other people's projects)
    if (selectedProjectSQL.rows[0].user_id == req.user.userid) {
      //  The project belongs to the logged user.

      const deleteProduct = await pool.query(
        "DELETE FROM projects WHERE projectid = $1",
        [id]
      );

      res
        .status(200)
        .send(
          `The project "${selectedProjectSQL.rows[0].name}" with id ${id} is deleted! Code: ${res.statusCode} `
        );
    } else {
      //  The project does not exists or don't belongs to the logged user.

      res.sendCustomStatus(400);
    }
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
