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
              message: "Email is not registered",
            });
          }
          //match pass
          bcrypt.compare(password, user.rows[0].password, (err, isMatch) => {
            if (err) throw err;


            if (isMatch) {
 
              return done(null, user.rows[0]);
            } else {
            
              return done(null, false, { message: "pass incorrect" });
            }
          });
        });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
