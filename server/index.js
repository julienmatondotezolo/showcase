const pool = require("./db");
const compression = require('compression');
const express = require("express");
const app = express();
const cors = require("cors");

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
    const size = req.query.size || null;
    const order = req.query.order || 'username';
    const filter = req.query.filter || 'asc';
    let query;
    if (size) {
      if (order) query = `SELECT * FROM users ORDER BY ${order} ${filter} limit ${size}`;
      else query = `SELECT * FROM users limit ${size}`;
    } else if (order) {
      query = `SELECT * FROM users ORDER BY ${order} ${filter}`;
    } else {
      query = `SELECT * FROM users`;
    }
    const allProducts = await pool.query(query);
    // const allProducts = await pool.query("SELECT COUNT(*) as count FROM public");
    res.json(allProducts.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Get projects by name
app.get("/api/search/name/:name/", async (req, res) => {
  try {
    const name = req.params.name || req.query.name;
    const order = req.query.order || 'name';
    const description = req.query.description || req.query.description;
    const filter = req.query.filter || 'asc';
    let query;

    if (name) {
      if (order) query = `SELECT * FROM projects WHERE LOWER(product_name) LIKE LOWER($1) ORDER BY ${order} ${filter} limit ${size}`;
      else query = `SELECT * FROM projects WHERE LOWER(product_name) LIKE LOWER($1) limit ${size}`;
    } else if (description) {
      query = `SELECT * FROM projects WHERE LOWER(description) LIKE LOWER($1) ORDER BY ${order} ${filter}`;
    } else {
      query = `SELECT * FROM projects WHERE LOWER(product_name) LIKE LOWER($1)`;
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

// app.put("/api/products/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { description } = req.body;
//     const updateProduct = await pool.query(
//       "UPDATE projects SET description = $1 WHERE id = $2",
//       [description, id]
//     );

//     res.json("projects was updated!");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

//delete a projects

// app.delete("/api/products/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleteProduct = await pool.query("DELETE FROM projects WHERE id = $1", [
//       id
//     ]);
//     res.json("projects was deleted!");
//   } catch (err) {
//     console.log(err.message);
//   }
// });

app.listen(process.env.PORT || 5000, () => {
  console.log("server has started on port 5000");
});