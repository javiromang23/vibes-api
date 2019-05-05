"use strict";

const User = require("../models/User");

/* Permissions validation */
async function permissionsValidation(req, res, next) {
  try {
    let userFound = await User.findOne({
      username: req.params.username
    }).select("-password");
    if (userFound) {
      if (req.user != userFound._id) {
        return res.status(403).send({
          message: "Forbidden: You don't have permission to access on this user"
        });
      }
      next();
    } else {
      return res.status(404).send({
        message: "User not found"
      });
    }
  } catch (err) {
    return res.status(500).send({ message: `Error server: ${err}` });
  }
}

module.exports = {
  permissionsValidation
};
