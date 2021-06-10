const pool = require("./db");
const compression = require('compression');
const express = require("express");
const app = express();
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDocs = require('../swagger.json')


// Compress all HTTP responses
app.use(compression());
//middleware
app.use(cors());
app.use(express.json()); //req.body

// ROUTES //
app.get("/", async (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

//Get all users
app.get("/api/users", async (req, res) => {
  try {
    const name = req.params.name || req.query.name;
    const order = req.query.order || 'username';
    const filter = req.query.filter || 'asc';
    let query;
    if (name) {
      if (order) query = `SELECT * FROM users ORDER BY ${order} ${filter}`;
      else query = `SELECT * FROM users`;
    } else if (order) {
      query = `SELECT * FROM users ORDER BY ${order} ${filter}`;
    } else {
      query = `SELECT * FROM users`;
    }
    const allusers = await pool.query(query);
    res.json(allusers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Get all users
app.get("/api/allprojects", async (req, res) => {
  try {
    const name = req.params.name || req.query.name;
    const order = req.query.order || 'name';
    const filter = req.query.filter || 'asc';
    let query;
    if (name) {
      if (order) query = `SELECT * FROM projects ORDER BY ${order} ${filter}`;
      else query = `SELECT * FROM projects`;
    } else if (order) {
      query = `SELECT * FROM projects ORDER BY ${order} ${filter}`;
    } else {
      query = `SELECT * FROM projects`;
    }
    const allProjects = await pool.query(query);
    res.json(allProjects.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Get projects by name
app.get("/api/search/projects/:name/", async (req, res) => {
  try {
    const name = req.params.name || req.query.description;
    const order = req.query.order || 'name';
    const filter = req.query.filter || 'asc';
    let query;

    if (name) {
      if (order) query = `SELECT * FROM projects WHERE LOWER(name) LIKE LOWER($1) ORDER BY ${order} ${filter}`;
      else query = `SELECT * FROM projects WHERE LOWER(name) LIKE LOWER($1)`;
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

//update a projects

app.put("/api/projects/:id", async (req, res) => {
  try {
   const { id } = req.params;
   const {userId,edit_date,images,url,description,name } = req.body;
   const updateProduct = await pool.query( "UPDATE projects SET user_id = $1,edit_date = $2,images = $3,url = $4,description = $5 ,name = $6 WHERE projectid = $7", [userId,edit_date,images,url,description,name,id]  );

     res.json("projects was updated!");
   } catch (err) {
    console.error(err.message);
  }
 });

//delete a projects

app.delete("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await pool.query("DELETE FROM projects WHERE projectid = $1", [
      id
    ]);
    res.json("Project was deleted!");
  } catch (err) {
    console.log(err.message);
  }
})
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(process.env.PORT || 5000, () => {
  console.log("server has started on port 5000");
});