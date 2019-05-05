"use strict";

const express = require("express");
const followController = require("../controllers/follow");
const auth = require("../middlewares/auth");
const permissions = require("../middlewares/permissions");
const api = express.Router();

api.get("/test-follow", followController.test);
api.post("/follow", auth, followController.saveFollow);
api.post("/accept-follow", auth, followController.acceptFollow);

module.exports = api;
