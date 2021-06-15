const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  let errors = [];
  try {
    let { email, password, password2 } = req.body;


    if (checkCredentials(email, password, password2)) {
      let username = createUsername(email);
      encryptPasswordAndAddUserInDb(username, email, password);
    } else {
      res.sendCustomStatus(500, errors);
    }
  } catch (err) {
    console.error(err.message);
  }

  function encryptPasswordAndAddUserInDb(username, email, password) {
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        //save pass to hash
        password = hash;
        addUserInDb(username, email, password);
      })
    );
  }

  async function addUserInDb(username, email, password) {
    let values = [email, password, username];

    try {
      const newUser = await pool.query(
        "INSERT INTO users(email, password, username) VALUES($1, $2, $3) RETURNING *",
        values
      );
    } catch (err) {
      console.log(err.code);
      if (err.code === "ER_DUP_ENTRY" || err.code === "23505") {
        res.sendCustomStatus(403, "E-mail already exists");
        return;
      } else {
        res.sendCustomStatus(500);
        return;
      }
    }

    res.sendCustomStatus(200, "Succesfully registered");
  }

  function checkCredentials(email, password, password2) {
    console.log(" email :" + email + " pass:" + password);
    if (!email || !password || !password2) {
      errors.push(" Please fill in all fields");
    }

    //check if match
    if (password !== password2) {
      errors.push(" Passwords don't match");
    }

    //check if password is more than 6 characters
    if (password.length < 6) {
      errors.push(" Password atleast 6 characters");
    }


    if (!email.includes("@student.ehb") && !email.includes("@ehb")) {
      errors.push(" Not EHB mail");
    }

    if (errors.length > 0) {
      //here code if not pass
      console.log(" Errors, not passed!");
      console.log(errors);
      return false;
    }

    return true;
  }

  function createUsername(email) {
    const uppercaseWords = (str) =>
      str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());

    let name = email.substr(0, email.indexOf("@"));
    let lowercaseName = name.replaceAll(".", " ");
    let uppercaseName = uppercaseWords(lowercaseName);

    return uppercaseName;
  }
});

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("upload");
    return;
  }
  console.log("you are trying to get register");
  res.render("register.ejs");
});

module.exports = router;
