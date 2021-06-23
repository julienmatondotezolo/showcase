const express = require("express");
const router = express.Router();

router.use(function (req, res, next) {
  res.sendCustomStatus = (statusCode, extraMessage = "") => {
    const status = {
      200: "OK.",
      201: "Created; response to a successful POST.",
      204: "No Content; OK but nothing to return.",
      304: "Not modified.",
      400: "Bad Request: wrong URL, params or undefined problem.",
      401: "Unauthorised: not logged in or wrong credentials.",
      403: "Forbidden: no permission for this request.",
      404: "Not Found: what you request does not exist.",
      500: "Internal Server Error: general server error.",
      502: "Bad Gateway: error while server was accessing another server.",
    };

    return res.status(statusCode).send({
      code: statusCode,
      message: status[statusCode],
      customMessage: extraMessage
    });
  };
  next();
});

module.exports = router;
