"use strict";

const serviceJwt = require("../services/jwt");

function isAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({
      message: "Forbidden: You don't have permission to access on this server"
    });
  }

  const token = req.headers.authorization;
  serviceJwt
    .decodeToken(token)
    .then(response => {
      req.user = response;
      next();
    })
    .catch(response => {
      res.status(response.status);
    });
}

module.exports = isAuth;
