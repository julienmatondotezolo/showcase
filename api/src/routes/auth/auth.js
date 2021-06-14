const send = require("../status/status");

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      console.log('Julien le jean-michel')
      res.sendCustomStatus(401);
    }
  },
};
