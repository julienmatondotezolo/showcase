if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const path = require("path");
const express = require("express");
const multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/public/uploads/')
  },
  filename: function (req, file, cb) { 
    cb(null, req.body.cluster + Date.now() + '.' + file.mimetype.replace("image/", ""))
  }
});
const upload = multer({ storage: storage });
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
const searchName = require("./routes/final_work/search-name");

const addUser = require("./routes/users/add");
const deleteUser = require("./routes/users/delete");
const getAllUsers = require("./routes/users/get-all");
const getSingleUser = require("./routes/users/get-single");

const updateUser = require("./routes/users/update");

const vote = require("./routes/admin/vote");

const router = require("./routes/users/add");
const { compareSync } = require("bcrypt");

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

// app.use(
//   fileUpload({
//     limits: {
//       fileSize: 50 * 1024 * 1024,
//     },
//   })
// );

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

app.post("/upload", upload.single('image'), async (req, res) => {
  const PUBLIC_URL = "http://193.191.183.48:3000/";
  const { originalname, path } = req.file;
  let images = PUBLIC_URL + path.split("/public/").pop();

  let { projectname, description, url, cluster } = req.body;
  let userId = req.user.userid;

  if (check(cluster)) {
    let values = [projectname, description, url, images, cluster, userId];
    try {
      const newProject = await pool.query(
        "INSERT INTO projects(name, description, url, images, cluster, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        values
      );

      res.send("Project succesfully uploaded.");
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

  // async function imgCloudinaryURL(imageData) {
  //   let imageToB64 = bytesToBase64(imageData)

  //   const result = await cloudinary.uploader.upload(imageToB64, {
  //     folder: "showcaseimg/"
  //   });
  //   return result.url
  // }
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
  res.redirect("login");
});

app.get("/detailproject", (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
    return;
  }
  res.render("detailproject.ejs", {
    username: req.user.username,
  });
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
app.use("/final-work/search-name", searchName);

app.use("/final-work/update", ensureAuthenticated, updateFw);

app.use("/users/add", addUser);
app.use("/users/delete", ensureAuthenticated, deleteUser);
app.use("/users/get-all", getAllUsers);
app.use("/users/get-single", getSingleUser);
app.use("/users/update", ensureAuthenticated, updateUser);

app.use("/admin/vote", vote);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

function bytesToBase64(bytes) {
  const base64abc = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/",
  ];

  let result = "",
    i,
    l = bytes.length;
  for (i = 2; i < l; i += 3) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)];
    result += base64abc[bytes[i] & 0x3f];
  }
  if (i === l + 1) {
    // 1 octet yet to write
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 0x03) << 4];
    result += "==";
  }
  if (i === l) {
    // 2 octets yet to write
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[(bytes[i - 1] & 0x0f) << 2];
    result += "=";
  }
  return "data:image/jpeg;base64," + result;
}
