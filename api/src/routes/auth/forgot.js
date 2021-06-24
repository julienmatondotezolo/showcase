const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const bcrypt = require("bcrypt");
var crypto = require("crypto");
require("dotenv").config();
var nodemailer = require("nodemailer");
let errors = [];

router.post("/", async (req, res) => {

    const userSelected = await pool.query(
      `SELECT * FROM users where email = '${req.body.email}'`
    );
    if (userSelected.rows[0]===undefined) {
      console.log("there is an error")
      res.sendCustomStatus(400, "Your email does not exist or incorrect");
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
    Hey ${userSelected.rows[0].username}, did you want to reset your password?\n 
     Someone (hopefully you) has asked us to reset the password for your FinalShow account. Please click the link below to do so. If you didn't request this password reset, you can go ahead and ignore this email!\n 
    Please click on the following link, or paste this into your browser to complete the process:
    <a href="http://api-finalshow.be:3000/forgot/reset/${reset.token}">http://api-finalshow.be:3000/forgot/reset/${reset.token}</a>\n 
    This link will expire in one hour.
  `;

    emailSend(userSelected.rows[0].email, emailBody);

    res.redirect(`/forgot/recover?email=${userSelected.rows[0].email}`);
  
});

router.post("/reset/:token",async (req, res) => {
  const tok = req.params.token;

  console.log("here is the token for post " + tok);
  const resetToken = await pool.query(
    `SELECT * FROM resettoken WHERE token = '${tok}'`
  );
  console.log("expiration " + resetToken.rows[0].expires);
  if(resetToken.rows[0] ===undefined){
    res.send("error: Your reset token is invalid");
  }else if (Date.now() > resetToken.rows[0].expires) {
    req.flash("error", "Password reset token is invalid or has expired.");
    return res.redirect("/forgot");
  }
  if (checkCredentials(req.body.newPassword, req.body.confirmPassword)) {
    encryptPassword(resetToken.rows[0].user_id, req.body.newPassword);
    console.log('your password has been updated');
    res.redirect('/login')
  } else {
    res.sendCustomStatus(400, errors);
  }
  try {
    const deleteToken = await pool.query(
      "DELETE FROM resettoken WHERE user_id = $1",
      [resetToken.rows[0].user_id]
    );
  } catch (err) {
    console.error("the error delete", err.message);
    res.sendCustomStatus(400);
  }
});

router.get("/reset/:token", async (req, res) => {
  const tok = req.params.token;
 try{
  const resetToken = await pool.query(
    `SELECT * FROM resettoken WHERE token = '${tok}'`
  );
 
  if(resetToken.rows[0] ===undefined){
    res.send("error: Your reset token is invalid");
  }else if (Date.now() > resetToken.rows[0].expires) {
    console.log("Password reset token is invalid or has expired");
    res.send("error", "Password reset token is invalid or has expired.");
    //return res.redirect("/forgot");
  } else {
    console.log("token found");
    res.render("reset.ejs");
  }
}  catch (err) {
    console.error("the error for insert " + err.message);
  }
});

router.get("/", async (req, res) => {
  res.render("forgotPassword.ejs", { user: req.user });
});
router.get("/recover", async (req, res) => {
  res.render("emailSend.ejs", { user: req.user });
});

async function emailSend(emailTo, bodyEmail) {
  console.log("the email " + emailTo);
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
    to: emailTo, // list of receivers
    subject: "RESET password: FINALSHOW ✔", // Subject line
    text: bodyEmail, // plain text body
    html: `
    <b>Reset Password: FinalShow</b>  <p> ${bodyEmail}</p>`, // html body
  });
}

function checkCredentials(password, password2) {
  if (!password || !password2) {
    errors.push(" Please fill in all fields");
  }

  if (password !== password2) {
    errors.push(" Passwords don't match");
  }

  if (password.length < 6) {
    errors.push(" Password atleast 6 characters");
  }

  if (errors.length > 0) {
    //here code if not pass
    console.log(" Errors, not passed!");
    console.log(errors);
    return false;
  }

  return true;
}

async function updateDb(id, pass) {
  console.log("update ....");
  try {
    const updateUser = await pool.query(
      `UPDATE users SET userid = $1, password = $2 WHERE userid =${id} `,
      [id, pass]
    );

    console.log("password has been updated");
  } catch (err) {
    console.error("the error for update " + err.message);
  }
}

function encryptPassword(id, password) {
  bcrypt.genSalt(10, (err, salt) =>
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      //save pass to hash
      password = hash;
      updateDb(id, password);
    })
  );
}
module.exports = router;
