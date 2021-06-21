const passport = require("passport");
const send = require("../status/status");

module.exports = {
  ensureStudent: function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.role === "admin") {
        return next();
      }

      if (req.user.role === "student") {
        return next();
      } else {
        res.redirect("/dashboard-docent");
      }
    } else {
      res.redirect("/login");
    }
  },
};
