"use strict";

const express = require("express");
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");
const permissions = require("../middlewares/permissions");
const api = express.Router();

api.get("/test-user", userController.test);
api.get("/userById/:id", auth, userController.getUserById);
api.get("/user/:username", auth, userController.getUserByUsername);
api.get("/user/:username/:imageFile", userController.getImageFile);
api.get("/check-reset/:hash", userController.checkTokenReset);
api.get("/search-user/:username", auth, userController.searchUsers);
api.put(
  "/user/:username",
  [auth, permissions.permissionsValidation],
  userController.updateUser
);
api.post("/signin", userController.signIn);
api.post("/signup", userController.signUp);
api.post("/resetPassword", userController.sendResetPassword);
api.post(
  "/resetPassword/:username",
  [auth, permissions.permissionsValidation],
  userController.resetPassword
);
api.post("/resetPasswordByEmail/:hash", userController.resetPasswordByEmail);
api.delete(
  "/user/:username",
  [auth, permissions.permissionsValidation],
  userController.deleteUser
);

module.exports = api;
