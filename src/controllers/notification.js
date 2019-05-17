"use strict";

const Notification = require("../models/Notification");
const User = require("../models/User");
const parameters = require("../parameters");

const notificationController = {
  test: (req, res) => {
    res.status(200).send({ message: "Testing notificationController..." });
  }
};

module.exports = notificationController;
