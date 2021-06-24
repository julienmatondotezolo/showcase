const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  try {
    checkNominationList();
  } catch (err) {
    res.sendCustomStatus(500);
  }

  async function checkNominationList() {
    let { id } = req.body;
    let docentId = req.user.userid;

    const allDocentNominationList = await pool.query(
      `SELECT 
      nominations.id, 
      nominations.project_id, 
      projects."cluster", 
      projects."name"  
      FROM 
      nominations 
      INNER JOIN 
      projects 
      ON nominations.project_id = 
      projects.projectid 
      AND nominations.user_id = ${docentId}`
    );

    const votedProject = await pool.query(
      `SELECT * FROM projects WHERE projectid = ${id}`
    );



    console.log("here id", id);
    console.log("here", votedProject.rows[0]);

    if (!allDocentNominationList.rows.length) {
      giveCorrectGradeDependingOnPosition(1, 3);
    } else {
      if (
        checkIfDifferentCluster(
          allDocentNominationList.rows,
          votedProject.rows[0].cluster
        )
      ) {
        giveCorrectGradeDependingOnPosition(
          allDocentNominationList.rows.length + 1,
          3
        );
      }
    }
  }

  async function giveCorrectGradeDependingOnPosition(
    rankPosition,
    maxPosition
  ) {
    const availableGrades = [5, 3, 1];
    let gradeToGive = availableGrades[rankPosition - 1];

    let { id } = req.body;
    let docentId = req.user.userid;
    let values = [id, docentId, gradeToGive];

    if (rankPosition < 1 || rankPosition > maxPosition) {
      res.sendCustomStatus(
        400,
        `Cannot nominate for more than ${maxPosition} projects`
      );
      return;
    }

    const insertGrade = await pool.query(
      "INSERT INTO nominations(project_id, user_id, points) VALUES($1, $2, $3) RETURNING *",
      values
    );
    const nominatedProject = await pool.query(
      `SELECT name FROM projects where projectid = ${id}`
    );

    res.sendCustomStatus(
      200,
      `Project ${nominatedProject.rows[0].name} successfully nominated!`
    );
    return gradeToGive;
  }


  function checkIfDifferentCluster(projectsAlreadyVoted, projectToVoteCluster) {
    let canVote = true;
    projectsAlreadyVoted.forEach((project) => {
      if (project.cluster === projectToVoteCluster) {
        res.sendCustomStatus(400, "Cannot nominate for 2 projects of same cluster");
        canVote = false;
        return false;
      }
    });
    if (canVote) {
      return true;
    }
  }
});
module.exports = router;
