if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const path = require("path");
const express = require("express");
const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      req.body.cluster + Date.now() + "." + file.mimetype.replace("image/", "")
    );
  },
});

const upload = multer({ storage: storage });
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
const { ensureDocent } = require("./routes/auth/ensureDocent");
const { ensureStudent } = require("./routes/auth/ensureStudent");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));

app.set("view-engine", "ejs");
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
const uploadGet = require("./routes/final_work/upload-get");
const uploadPost = require("./routes/final_work/upload-post");
const searchName = require("./routes/final_work/search-name");
const filterCluster = require("./routes/final_work/filter-cluster");
const dashboardDocent = require("./routes/dashboard/dashboard-docent");
const detailProject = require("./routes/final_work/detail-project");
const addEmail = require("./routes/mail/add-email");
const addUser = require("./routes/users/add");
const deleteUser = require("./routes/users/delete");
const getAllUsers = require("./routes/users/get-all");
const getSingleUser = require("./routes/users/get-single");
const forgotPass = require("./routes/auth/forgot");

const updateUser = require("./routes/users/update");

const vote = require("./routes/admin/vote");
const unvote = require("./routes/admin/unvote");
const myVotes = require("./routes/admin/my-votes");
const allVotes = require("./routes/admin/all-votes");
const votesByProject = require("./routes/admin/votes-project");
const favorite = require("./routes/admin/favorite");
const myFavorites = require("./routes/admin/my-favorites");
const nominate = require("./routes/admin/nominate");
const myNominations = require("./routes/admin/my-nominations");
const getNominations = require("./routes/admin/get-nominations");

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

app.use(passport.initialize());
app.use(passport.session());
app.use(status);
app.use(flash());
require("./routes/auth/passport")(passport);

//*  ====== UPLOAD STUDENT PROJECTS ====== *//

app.get("/", (req, res) => {
  console.log("GET");
  res.redirect("login");
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/login", login);
app.use("/register", register);
app.use("/logout", logout);
app.use("/forgot", forgotPass);

app.use("/final-work/create", ensureAuthenticated, createFw);
app.use("/final-work/delete", ensureAuthenticated, deleteFw);
app.use("/final-work/get-all", getAllFw); // REMOVE ensureAuthenticated
app.use("/final-work/filter-cluster", filterCluster);
app.use("/final-work/get-single", getSingleFw);
app.use(
  "/final-work/get-user-projects",
  ensureAuthenticated,
  getAllUserProjects
);
app.use("/final-work/get-byid", getById);
app.use("/final-work/search-name", searchName);

app.use("/final-work/update", ensureAuthenticated, updateFw);

app.use("/users/add", addUser);
app.use("/users/delete", ensureAuthenticated, deleteUser);
app.use("/users/get-all", getAllUsers);
app.use("/users/get-single", getSingleUser);
app.use("/users/update", ensureAuthenticated, updateUser);
app.use("/upload", ensureStudent, uploadGet);
app.use("/upload", upload.single("image"), uploadPost);
app.use("/dashboard-docent", ensureDocent, dashboardDocent);
app.use("/detailproject", ensureDocent, detailProject);
app.use("/add-email", addEmail);
app.use("/admin/vote", ensureDocent, vote);
app.use("/admin/my-votes", ensureDocent, myVotes);
app.use("/admin/all-votes", ensureDocent, allVotes);
app.use("/admin/votes-project", ensureDocent, votesByProject);
app.use("/admin/unvote", ensureDocent, unvote);
app.use("/admin/favorite", ensureDocent, favorite);
app.use("/admin/my-favorites", ensureDocent, myFavorites);
app.use("/admin/nominate", ensureDocent, nominate);
app.use("/admin/get-nominations", getNominations);
app.use("/admin/my-nominations", myNominations);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
