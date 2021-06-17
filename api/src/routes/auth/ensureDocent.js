const passport = require("passport");
const send = require("../status/status");

module.exports = {
  ensureDocent: function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.role !== "student") {
        return next();
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  },
};
