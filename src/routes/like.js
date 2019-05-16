"use strict";

const express = require("express");
const likeController = require("../controllers/like");
const auth = require("../middlewares/auth");
const api = express.Router();

api.get("/test-like", likeController.test);
api.post("/like/:publication", auth, likeController.saveLike);

module.exports = api;
