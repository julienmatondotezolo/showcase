const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  let { id } = req.body;
  let docentId = req.user.userid;
  let values = [id, docentId];

  console.log(id);
  if (await check(id)) {
    try {
      const favoriteProject = await pool.query(
        "INSERT INTO favorites(project_id, user_id) VALUES($1, $2) RETURNING *",
        values
      );
      res.sendCustomStatus(200, "Favorite added");
    } catch (err) {
      console.error(err.message);
      res.sendCustomStatus(500);
    }
  }

  async function check(projectId) {
    try {
      let alreadyFavorite = false;
      let alreadyFavoriteClusterId = 0;

      const allVotedProjects = await pool.query(
        `SELECT favorites.id, favorites.user_id, project_id, cluster FROM favorites INNER JOIN projects ON favorites.project_id = projects.projectid AND favorites.user_id = ${docentId}`
      );

      console.log(allVotedProjects.rows[0]);

      allVotedProjects.rows.forEach((alreadyVotedProject) => {
        console.log(alreadyVotedProject.id);
        if (alreadyVotedProject.project_id == parseInt(projectId)) {
          alreadyFavorite = true;
          alreadyFavoriteClusterId = alreadyVotedProject.id;
        }
      });

      if (alreadyFavorite) {
        try {
          const deleteFavoriteProject = await pool.query(
            "DELETE FROM favorites WHERE id = $1",
            [alreadyFavoriteClusterId]
          );
        } catch (err) {
          res.sendCustomStatus(500);
          return false;
        }
        res.sendCustomStatus(200, "Favorite deleted");
        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.log(err);
      res.sendCustomStatus(500);
      return false;
    }
  }
});

module.exports = router;
