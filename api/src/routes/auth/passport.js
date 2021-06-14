const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const pool = require("../../db/db");

module.exports = async function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      let user = pool
        .query(`SELECT * FROM users where email = '${email}'`)
        .then((user) => {
          if (!user.rows[0]) {
            return done(null, false, {
              message: "that email is not registered",
            });
          }
          //match pass
          bcrypt.compare(password, user.rows[0].password, (err, isMatch) => {
            if (err) throw err;

            console.log(user.rows[0].password);
            console.log(password);
            if (isMatch) {
              console.log("OUEEEEEEEE");
              return done(null, user);
            } else {
              console.log("NEEEEEEEE");
              return done(null, false, { message: "pass incorrect" });
            }
          });
        });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.rows[0]);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
