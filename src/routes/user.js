"use strict";

const express = require("express");
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");
const permissions = require("../middlewares/permissions");
const api = express.Router();

api.get("/test-user", userController.test);
api.get("/user/:username", auth, userController.getUser);
api.put(
  "/user/:username",
  [auth, permissions.permissionsValidation],
  userController.updateUser
);
api.post("/signin", userController.signIn);
api.post("/signup", userController.signUp);
api.delete(
  "/user/:username",
  [auth, permissions.permissionsValidation],
  userController.deleteUser
);

module.exports = api;
