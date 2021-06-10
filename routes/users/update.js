const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const bcrypt = require("bcrypt");

router.put("/", async (req, res) => {
  res.send("update-user route!");

  const { email, password, password2, username, role, avatar } = req.body;
  if (checkCredentials(username, email, password, password2)) {
    encryptPasswordAndEditUserInDb(username, email, password, role, avatar);
  }

  function encryptPasswordAndEditUserInDb(
    username,
    email,
    password,
    role,
    avatar
  ) {
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        //save pass to hash
        password = hash;
        editUserInDb(username, email, password, role, avatar);
      })
    );
  }

  async function editUserInDb(username, email, password, role, avatar) {
    let user_id = req.user?.userid;
    let edit_date = new Date().toISOString().slice(0, 19).replace("T", " ");

    const updateUser = await pool.query(
      "UPDATE users SET email = $1, password = $2, username = $3, role = $4, avatar = $5, edit_date = $6 WHERE userid = $7",
      [email, password, username, role, avatar, edit_date, user_id]
    );
  }

  function checkCredentials(username, email, password, password2) {
    let errors = [];
    console.log(
      " username:" + username + " email :" + email + " pass:" + password
    );
    if (!username || !email || !password || !password2) {
      errors.push({ msg: "Please fill in all fields" });
    }

    //check if match
    if (password !== password2) {
      errors.push({ msg: "passwords dont match" });
    }

    //check if password is more than 6 characters
    if (password.length < 6) {
      errors.push({ msg: "password atleast 6 characters" });
    }
    if (errors.length > 0) {
      //here code if not pass
      console.log("errors, not passed!");
      console.log(errors);
      return false;
    }
    return true;
  }
});

module.exports = router;
