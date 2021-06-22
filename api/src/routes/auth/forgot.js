const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const bcrypt = require("bcrypt");
var crypto = require("crypto");
require("dotenv").config();
var nodemailer = require("nodemailer");

async function emailSend(bodyEmail) {
  let transporter = nodemailer.createTransport({
    host: "smtp-auth.mailprotect.be",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@api-finalshow.be", // generated ethereal user
      pass: "FinalshowFPV4", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Finalshow BACKEND team 👻" <info@api-finalshow.be>', // sender address
    to: "chai.1997@hotmail.fr", // list of receivers
    subject: "Hi WE ARE HOW ARE YOU ✔", // Subject line
    text: bodyEmail, // plain text body
    html: `
    <b>Hello world?</b>  <p> ${bodyEmail}   </p>`, // html body
  });
}

router.post("/", async (req, res) => {
  try {
    const userSelected = await pool.query(
      `SELECT * FROM users where email = '${req.body.email}'`
    );
    if (!userSelected) {
      req.flash("error", "No account with that email address exists.");
      return res.redirect("/forgot");
    }

    const reset = {
      token: crypto.randomBytes(16).toString("hex"),
      user_id: userSelected.rows[0].userid,
      expires: Date.now() + 3600000,
    };

    try {
      const reset_token = await pool.query(
        "INSERT INTO resettoken (token, user_id, expires) VALUES($1, $2, $3) RETURNING *",
        [reset.token, reset.user_id, new Date(reset.expires)]
      );
    } catch (err) {
      console.error("the error for insert " + err.message);
    }

    let emailBody = `
    You are receiving this because you (or someone else) have requested the reset of the password for your account.
    Please click on the following link, or paste this into your browser to complete the process:
    <a href="http://localhost:3000/forgot/reset/${reset.token}">http://localhost:3000/forgot/reset/${reset.token}</a>
    If you did not request this, please ignore this email and your password will remain unchanged.
  `;

    emailSend(emailBody);

    res.redirect("/forgot");
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});

router.post("/reset/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const resetToken = await pool.query(
      `SELECT * FROM resettoken where token = '${token}' AND expires > (to_timestamp(${Date.now()} / 1000.0))`
    );
    if (!resetToken) {
      req.flash("error", "Password reset token is invalid or has expired.");
      return res.redirect("/forgot");
    }

    try {
      console.log("reset your id "+resetToken.user_id)
      const updateUser = await pool.query(
        `UPDATE users SET password = $2 WHERE userid =${resetToken.user_id} `,
        [req.body.password]
      );
    } catch (err) {
      console.error("the error update", err.message);
      res.sendCustomStatus(500);
    }

    try {
      const deleteToken = await pool.query(
        "DELETE FROM resettoken WHERE user_id = $1",
        [resetToken.user_id]
      );
    } catch (err) {
      console.error("the error select", err.message);
      res.sendCustomStatus(500);
    }

  } catch (err) {
    console.error("error delete " + err.message);
    res.sendCustomStatus(500);
  }
});

function encryptPassword(password) {
  bcrypt.genSalt(10, (err, salt) =>
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      //save pass to hash
      password = hash;
return password;
    })
  );
}
router.get("/reset/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const resetToken = await pool.query(
      `SELECT * FROM resettoken where token = '${token}' AND expires > (to_timestamp(${Date.now()} / 1000.0))`
    );
     
    if (!resetToken) {
      console.log('token not found')
      req.flash("error", "Password reset token is invalid or has expired.");
      return res.redirect("/forgot");
    }

    res.render("reset.ejs", { user: req.user });
  } catch (err) {
    console.error("error token here " +err.message);
    res.sendCustomStatus(500);
  }
});

router.get("/", async (req, res) => {
  res.render("forgotPassword.ejs", { user: req.user });
});

module.exports = router;
