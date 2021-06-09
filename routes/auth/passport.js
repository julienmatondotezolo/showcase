const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const pool = require("../../db/db");

module.exports = async function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      let user = pool
        .query(`SELECT * FROM users where email = '${email}'`)
        .then((user) => {
          //   console.log(user);
          //   console.log("here...", password, user.rows[0].password);
          if (!user.rows[0]) {
            return done(null, false, {
              message: "that email is not registered",
            });
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
        });
      //match user
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.rows[0]);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  // deserialize ?????????????????
};
