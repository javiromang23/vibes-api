"use strict";

const Notification = require("../models/Notification");
const User = require("../models/User");
const parameters = require("../parameters");

const notificationController = {
  test: (req, res) => {
    res.status(200).send({ message: "Testing notificationController..." });
  },
  saveNotification: (req, res) => {
    if (
      req.params.user != "" &&
      req.params.user != undefined &&
      req.body.html != undefined &&
      req.body.html != ""
    ) {
      let notification = new Notification();
      notification.html = req.body.html;
      notification.user = req.params.user;
      notification.toDate = Date.now();

      Notification.create(notification, (err, notificationStored) => {
        if (err)
          return res.status(500).send({ message: `Error server: ${err}` });
        if (!notificationStored)
          return res
            .status(401)
            .send({ message: `The notification could not be saved.` });

        return res.status(200).send({
          message: "Notication stored.",
          publication: notificationStored
        });
      });
    } else {
      return res
        .status(400)
        .send({ message: "Missing arguments or are invalid" });
    }
  },
  getNotificationsByUser: (req, res) => {
    Notification.find({ user: req.user }, (err, notifications) => {
      if (err) return res.status(500).send({ message: `Error server: ${err}` });
      if (!notifications)
        return res
          .status(401)
          .send({ message: `The notification could not be saved.` });

      return res.status(200).send({
        message: "Notications found.",
        notifications: notifications
      });
    });
  }
};

module.exports = notificationController;
