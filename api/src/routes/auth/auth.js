const send = require("../status/status");

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.sendCustomStatus(401);
    }
  },
};
