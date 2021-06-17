const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/:name", async (req, res) => {
  try {
    const name = req.params.name || req.query.name;
    const order = req.query.order || 'name';
    const description = req.query.description;
    const filter = req.query.filter || 'asc';
    let query;

    if (name) {
      if (order) query = `SELECT * FROM projects WHERE LOWER(name) LIKE LOWER($1) ORDER BY ${order} ${filter}`;
      else query = `SELECT * FROM projects WHERE LOWER(name) LIKE LOWER($1)`;
        } else if (description) {
          query = `SELECT * FROM projects WHERE LOWER(description) LIKE LOWER($1) ORDER BY ${order} ${filter}`;
                } else {
      query = `SELECT * FROM projects WHERE LOWER(name) LIKE LOWER($1)`;
    }
    await pool.query(query, [
      '%' + name + '%'
    ]).then((value) => {
      res.json(value.rows);
    }).catch((e) => {
      console.log(e);
      res.json(e);
    });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
