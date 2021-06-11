const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const bcrypt = require('bcrypt');

router.post("/", async (req, res) => {

    try {
        let {
            username,
            email,
            password,
            password2
        } = req.body;
        if (checkCredentials(username, email, password, password2)) {
            encryptPasswordAndAddUserInDb(username, email, password);
        }
    } catch (err) {
        console.error(err.message);
    }

    function encryptPasswordAndAddUserInDb(username, email, password) {
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(password, salt,
                (err, hash) => {
                    if (err) throw err;
                    //save pass to hash
                    password = hash;
                    console.log("here..", password)
                    addUserInDb(username, email, password);
                }));
    }

    async function addUserInDb(username, email, password) {
        let values = [
            email,
            password,
            username,
        ]
        const newUser = await pool.query(
            'INSERT INTO users(email, password, username) VALUES($1, $2, $3) RETURNING *', values)
        console.log("Succesfully registered")
        res.json("Succesfully registered");
    }

    function checkCredentials(username, email, password, password2) {
        let errors = [];
        console.log(' username ' + username + ' email :' + email + ' pass:' + password);
        if (!username || !email || !password || !password2) {
            errors.push({
                msg: "Please fill in all fields"
            })
        }

        //check if match
        if (password !== password2) {
            errors.push({
                msg: "passwords dont match"
            });
        }

        //check if password is more than 6 characters
        if (password.length < 6) {
            errors.push({
                msg: 'password atleast 6 characters'
            })
        }
        if (errors.length > 0) {
            //here code if not pass
            console.log("errors, not passed!")
            console.log(errors);
            return false;
        }
        return true;
    }
});

module.exports = router;