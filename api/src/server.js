if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const path = require("path");
const express = require("express");
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

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
app.use(status);
app.use(flash())
require("./routes/auth/passport")(passport);

app.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("index.ejs", { username: req.user.username });
});

router.get("/error", function(req, res, next) {
    res.render("error", {
        error: req.flash("error"),
    });
  });

app.get("/", (req, res) => {
  res.send("here is our site claqué");
});
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/login", login);
app.use("/register", register);
app.use("/logout", logout);

app.use("/final-work/create", ensureAuthenticated, createFw);
app.use("/final-work/delete", ensureAuthenticated, deleteFw);
app.use("/final-work/get-all", ensureAuthenticated, getAllFw); // REMOVE ensureAuthenticated
app.use("/final-work/get-single", getSingleFw);
app.use(
  "/final-work/get-user-projects",
  ensureAuthenticated,
  getAllUserProjects
);
app.use("/final-work/update", ensureAuthenticated, updateFw);

app.use("/users/add", addUser);
app.use("/users/delete", ensureAuthenticated, deleteUser);
app.use("/users/get-all", getAllUsers);
app.use("/users/get-single", getSingleUser);
app.use("/users/update", ensureAuthenticated, updateUser);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
