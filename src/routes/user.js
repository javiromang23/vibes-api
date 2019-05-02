"use strict";

const express = require("express");
const userController = require("../controllers/user");
const multipart = require("connect-multiparty");
const auth = require("../middlewares/auth");
const api = express.Router();
var dirUpload = multipart({
  uploadDir: __dirname + "/../uploads/users/avatars"
});

api.get("/test-user", userController.test);
api.get("/user/:username", auth, userController.getUser);
api.put("/user/:username", [auth, dirUpload], userController.updateUser);
api.post("/signin", userController.signIn);
api.post("/signup", userController.signUp);

module.exports = api;
