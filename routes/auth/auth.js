module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log(req.user);
      return next();
    }
    res.redirect("/please-connect");
  },
};
