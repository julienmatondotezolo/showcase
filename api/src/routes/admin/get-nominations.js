const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  try {
    const allVotedProjects = await pool.query(
      `SELECT projects.projectid,  projects.name,projects.cluster, projects.images, users.username, projects.winner FROM votes INNER JOIN projects ON votes.project_id = projects.projectid INNER JOIN users ON users.userid = projects.user_id ORDER BY project_id ASC`
    );
    const allNominatedProjects = await pool.query(
      `SELECT nominations.id,  nominations.points,  projects.projectid, projects.name   FROM nominations INNER JOIN projects ON nominations.project_id = projects.projectid  ORDER BY project_id ASC`
    );

    addTotalVotesToProjects(allVotedProjects.rows);
    let result = removeDuplicatedFromArray(allVotedProjects.rows);

    countTotalVotesAndNominationsPoints(result, allNominatedProjects.rows);

    let orderedResult = orderByClusters(result);

    res.send(orderedResult);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }

  function addTotalVotesToProjects(allVotedProjects) {
    let object = {};

    allVotedProjects.forEach((item) => {
      object[item.name] = object[item.name] ? object[item.name] + 1 : 1;
    });

    allVotedProjects.forEach((item) => {
      item.totalVotes = object[item["name"]];
    });
  }

  function removeDuplicatedFromArray(allVotedProjects) {
    var result = allVotedProjects.reduce((unique, o) => {
      if (!unique.some((obj) => obj.name === o.name)) {
        unique.push(o);
      }
      return unique;
    }, []);

    return result;
  }

  function countTotalVotesAndNominationsPoints(result, allNominatedProjects) {
    allNominatedProjects.forEach((element) => {
      result.forEach((item) => {
        if (element.projectid == item.projectid) {
          item.totalVotes += element.points;
        }
      });
    });
  }

  function orderByClusters(result) {
    let object = {
      motion: [],
      web: [],
      ar: [],
      mobile: [],
      "digital-making": [],
    };

    result.sort((a, b) =>
      a.totalVotes < b.totalVotes ? 1 : b.totalVotes < a.totalVotes ? -1 : 0
    );
    result.forEach((element) => {
      if (object[element.cluster].length < 3) {
        object[element.cluster].push(element);
      }
    });

    return object;
  }
});
module.exports = router;
