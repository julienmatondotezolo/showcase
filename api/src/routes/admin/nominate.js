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
    let { id, position } = req.body;
    let docentId = req.user.userid;
    console.log(req.body);
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

    const nominatedProjects = await pool.query(
      `SELECT * FROM nominations WHERE user_id = ${docentId}`
    );

    let maxNominations = 3;

    function checkIfMoreNominationsThanPossible() {
      if (allDocentNominationList.rows.length === maxNominations) {
        res.sendCustomStatus(400, `Cannot have more than ${allDocentNominationList.rows.length} nominations`);
        return false;
      } else {
        return true;
      }
    }

    function positionToPoints(position) {
      if (position === 1) {
        return 5;
      } else if (position === 2) {
        return 3;
      } else {
        return 1;
      }
    }

    function checkIfPositionAlreadyTaken(position) {

      let canVote = true;
      nominatedProjects.rows.forEach(project => {
        if (project.points === positionToPoints(position)) {
          res.sendCustomStatus(400, "Already voted for this position");
          canVote = false;
          return false;
        }
      })
      return canVote;
    }

    if (!allDocentNominationList.rows.length) {
      giveCorrectGradeDependingOnPosition(position);
    } else {
      if (
        checkIfDifferentCluster(
          allDocentNominationList.rows,
          votedProject.rows[0].cluster
        ) && checkIfMoreNominationsThanPossible()
        && checkIfPositionAlreadyTaken(position)
      ) {
        giveCorrectGradeDependingOnPosition(
          position
        );
      }
    }
  }

  async function giveCorrectGradeDependingOnPosition(
    rankPosition
  ) {
    const availableGrades = [5, 3, 1];
    let gradeToGive = availableGrades[rankPosition - 1];
    let { id } = req.body;
    let docentId = req.user.userid;
    let values = [id, docentId, gradeToGive];
    /* 
        if (rankPosition < 1 || rankPosition > maxPosition) {
          res.sendCustomStatus(
            400,
            `Cannot nominate more than ${maxPosition} projects`
          );
          return;
        } */

    const insertGrade = await pool.query(
      "INSERT INTO nominations(project_id, user_id, points) VALUES($1, $2, $3) RETURNING *",
      values
    );
    const nominatedProject = await pool.query(
      `SELECT name FROM projects where projectid = ${id}`
    );
    console.log("entered here my friend");
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
        res.sendCustomStatus(400, "cannot vote for 2 projects of same cluster");
        canVote = false;
        return false;
      }
    });
    return canVote;
  }
});
module.exports = router;
