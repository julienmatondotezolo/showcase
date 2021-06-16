if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const compression = require("compression");
const pool = require("./db/db");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const { ensureAuthenticated } = require("./routes/auth/auth");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));

app.set("view-engine", "ejs");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger.json");

const login = require("./routes/auth/login");
const register = require("./routes/auth/register");
const logout = require("./routes/auth/logout");

const status = require("./routes/status/status");
const createFw = require("./routes/final_work/create");
const deleteFw = require("./routes/final_work/delete");
const getAllFw = require("./routes/final_work/get-all");
const getSingleFw = require("./routes/final_work/get-single");
const getAllUserProjects = require("./routes/final_work/get-user-projects");
const updateFw = require("./routes/final_work/update");
const getById = require("./routes/final_work/get-byid");

const addUser = require("./routes/users/add");
const deleteUser = require("./routes/users/delete");
const getAllUsers = require("./routes/users/get-all");
const getSingleUser = require("./routes/users/get-single");

const updateUser = require("./routes/users/update");
const router = require("./routes/users/add");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(compression());
app.use(cors());
app.use(express.json());

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  fileUpload({
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(status);
app.use(flash());
require("./routes/auth/passport")(passport);

//*  ====== UPLOAD STUDENT PROJECTS ====== *//

app.get("/upload", (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
    return;
  }

  res.render("project.ejs", {
    username: req.user.username,
  });
});

app.post("/upload", ensureAuthenticated, async (req, res) => {
  const { name, data } = req.files.image;

  let images = data;
  let { projectname, description, url, cluster } = req.body;
  let userId = req.user.userid;

  let values = [projectname, description, url, images, cluster, userId];

  if (check(cluster)) {
    try {
      const newProject = await pool.query(
        "INSERT INTO projects(name, description, url, images, cluster, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        values
      );

      res.sendCustomStatus(200);
    } catch (err) {
      console.error(err.message);

      res.sendCustomStatus(500);
    }
  } else {
    res.sendCustomStatus(400);
  }

  function check(cluster) {
    let clusters = ["web", "mobile", "motion", "ar", "digital-making"];

    if (clusters.includes(cluster)) {
      return true;
    }
    return false;
  }
});

//*  ====== VOTING SYSTEM DOCENT ====== *//

app.get("/dashboard-docent", (req, res) => {
  if (!req.isAuthenticated()) {
    // || (req.user.role == "student") (redirect if student and allow if docent)
    res.redirect("/login");
    return;
  }

  /*   if (req.user.role == "admin") { */

  res.render("index.ejs", {
    username: req.user.username,
  });
  
  /* } else {
    res.redirect("/login");
  } */
});

router.get("/error", function (req, res, next) {
  res.render("error", {
    error: req.flash("error"),
  });
});

app.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    // || (req.user.role == "student") (redirect if student and allow if docent)
    res.redirect("/login");
    return;
  }

  /*   if (req.user.role == "admin") { */

  res.render("index.ejs", {
    username: req.user.username,
  });
  /* } else {
    res.redirect("/login");
  } */
});

app.get("/detailproject", (req, res) => {
  res.render("detailproject.ejs");
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/login", login);
app.use("/register", register);
app.use("/logout", logout);

app.use("/final-work/create", ensureAuthenticated, createFw);
app.use("/final-work/delete", ensureAuthenticated, deleteFw);
app.use("/final-work/get-all", getAllFw); // REMOVE ensureAuthenticated
app.use("/final-work/get-single", getSingleFw);
app.use(
  "/final-work/get-user-projects",
  ensureAuthenticated,
  getAllUserProjects
);
app.use("/final-work/get-byid", getById);

app.use("/final-work/update", ensureAuthenticated, updateFw);

app.use("/users/add", addUser);
app.use("/users/delete", ensureAuthenticated, deleteUser);
app.use("/users/get-all", getAllUsers);
app.use("/users/get-single", getSingleUser);
app.use("/users/update", ensureAuthenticated, updateUser);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
