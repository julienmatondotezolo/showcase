const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const pool = require("../../db/db");

module.exports = async function (passport) {
  const user = await pool.query(
    `SELECT * FROM users where email = 'youssef.sefiani@hotmail.com'`
  );
  console.log(user);
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //match user
      console.log("here...", password, user.rows[0].password);
      if (!user) {
        return done(null, false, { message: "that email is not registered" });
      }
      //match pass
      bcrypt.compare(password, user.rows[0].password, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "pass incorrect" });
        }
      });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.rows[0].userid);
  });

  passport.deserializeUser(function (id, done) {
    done(null, user.rows[0]);
  });
};
