const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  try {
    let { id } = req.body;
    let docentId = req.user.userid;
    let values = [id, docentId];

    const projectToWin = await pool.query(
      `SELECT superprijs.project_id, superprijs.user_id, projects.name from superprijs INNER JOIN projects on projects.projectid = superprijs.project_id and superprijs.project_id =  ${id}`
    );
    console.log(projectToWin.rows);

    if (!projectToWin.rows.length) {
      const voteProject = await pool.query(
        "WITH inserted AS (INSERT INTO superprijs(project_id, user_id) VALUES($1, $2) RETURNING *) SELECT projects.name FROM inserted INNER JOIN projects ON inserted.project_id = projects.projectid",
        values
      );

      res.sendCustomStatus(
        200,
        `${voteProject.rows[0].name} is nominated for the SUPERPRIJS!`
      );
    } else {
      const deleteSuperPrijs = await pool.query(
        `DELETE from superprijs where project_id = $1`,
        [id]
      );
      res.sendCustomStatus(
        404,
        `The nomination of the superprijs from the the project ${projectToWin.rows[0].name} is removed!`
      );
    }
  } catch (err) {
    console.log(err);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
