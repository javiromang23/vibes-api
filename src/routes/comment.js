"use strict";

const express = require("express");
const commentController = require("../controllers/comment");
const auth = require("../middlewares/auth");
const api = express.Router();

api.get("/test-comment", commentController.test);
api.post("/comment/:publication", auth, commentController.saveComment);
api.put("/comment/:comment", auth, commentController.updateComment);
api.delete("/comment/:comment", auth, commentController.deleteComment);
api.get(
  "/comment/:publication",
  auth,
  commentController.getCommentsByPublication
);

module.exports = api;
