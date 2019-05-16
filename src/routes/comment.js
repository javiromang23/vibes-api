"use strict";

const express = require("express");
const commentController = require("../controllers/comment");
const auth = require("../middlewares/auth");
const api = express.Router();

api.get("/test-comment", commentController.test);

module.exports = api;
