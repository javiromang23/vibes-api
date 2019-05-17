"use strict";

const express = require("express");
const notificationController = require("../controllers/notification");
const auth = require("../middlewares/auth");
const api = express.Router();

api.get("/test-notification", notificationController.test);

module.exports = api;
