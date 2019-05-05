"use strict";

const express = require("express");
const followController = require("../controllers/follow");
const auth = require("../middlewares/auth");
const permissions = require("../middlewares/permissions");
const api = express.Router();

api.get("/test-follow", followController.test);
api.post(
  "/follow/:username",
  [auth, permissions.permissionsValidation],
  followController.saveFollow
);
api.post(
  "/accept-follow/:username",
  [auth, permissions.permissionsValidation],
  followController.acceptFollow
);
api.delete(
  "/unfollow/:username",
  [auth, permissions.permissionsValidation],
  followController.unFollow
);

module.exports = api;
