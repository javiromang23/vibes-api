"use strict";

const express = require("express");
const followController = require("../controllers/follow");
const auth = require("../middlewares/auth");
const api = express.Router();

api.get("/test-follow", followController.test);
api.post("/follow/", auth, followController.saveFollow);
api.post("/accept-follow/", auth, followController.acceptFollow);
api.delete("/unfollow/", auth, followController.unFollow);
api.get("/followeds/:username", followController.getFolloweds);
api.get("/followers/:username", followController.getFollowers);

module.exports = api;
