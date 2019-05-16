"use strict";

const express = require("express");
const likeController = require("../controllers/like");
const auth = require("../middlewares/auth");
const api = express.Router();

api.get("/test-like", likeController.test);
api.post("/like/:publication", auth, likeController.saveLike);
api.delete("/like/:publication", auth, likeController.deleteLike);
api.get("/like/:publication", auth, likeController.getLikeByPublication);

module.exports = api;
