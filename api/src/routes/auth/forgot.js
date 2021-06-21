const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const bcrypt = require("bcrypt");
var nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

const transport = nodemailer.createTransport(nodemailerSendgrid({
  apiKey: process.env.SENDGRID_API_KEY,
}));


router.post("/", async (req, res) => {
  const user = await pool.query(`SELECT * FROM users where email = '${req.body.email}'`);

  if (!user) {
    req.flash('error', 'No account with that email address exists.');
    return res.redirect('/forgot');
  }

  let reset = {
    token: crypto.randomBytes(16).toString('hex'),
    user_id: user.userid,
    expires: Date.now() + 3600000
        }

  try {
    const reset_token = await pool.query(
      "INSERT INTO resetToken(token, user_id,expires) VALUES($1, $2) RETURNING *",
 reset
    );
    
    return res.status(200).json({message: "Reset password succesfully"})
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }

  
  const resetEmail = {
    to: req.body.email,
    from: 'chaimae.benhammou@student.ehb.be',
    subject: 'Node.js Password Reset',
    text: `
      You are receiving this because you (or someone else) have requested the reset of the password for your account.
      Please click on the following link, or paste this into your browser to complete the process:
      http://localhost:3000/forgot/${resettoken}
      If you did not request this, please ignore this email and your password will remain unchanged.
    `,
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',

  };
  await transport.sendMail(resetEmail);
  req.flash('info', `An e-mail has been sent to ${user.email} with further instructions.`);

  res.redirect('/forgot');

});


router.post('/reset/:token',async (req, res) => {
  try {
  const resetToken = await pool.query(
    `SELECT * FROM resetToken where token = ${req.params.token} AND expires > ${Date.now}`
  );
} catch (err) {
  console.error(err.message);
  res.sendCustomStatus(500);
}
  if (!resetToken) {
    req.flash('error', 'Password reset token is invalid or has expired.');
    return res.redirect('/forgot');
  }

  try {
    const updateUser = await pool.query(
      `UPDATE users SET password = $2 WHERE userid =${resetToken.user_id} `,
     [req.body.password]
    ); 
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
  

  const deleteToken = await pool.query(
  "DELETE FROM resetToken WHERE userid = $1",
  [resetToken.user_id]);



  });

 router.get('/reset/:token',async (req, res) => {
  try {
  const resetToken = await pool.query(`SELECT * FROM resetToken where token = ${req.params.token} AND expires > ${Date.now}`);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
  
  if (!resetToken) {
    req.flash('error', 'Password reset token is invalid or has expired.');
    return res.redirect('/forgot');
  }
  res.render('reset', {
    user: req.user
  });

 
  });

router.get("/", async (req, res) => {
    res.render("forgotPassword.ejs",{user: req.user});
  });

  
module.exports = router;
