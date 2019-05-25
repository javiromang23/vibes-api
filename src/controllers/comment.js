"use strict";

const Follow = require("../models/Follow");
const Publication = require("../models/Publication");
const Comment = require("../models/Comment");
const parameters = require("../parameters");

const commentController = {
  test: (req, res) => {
    res.status(200).send({ message: "Testing CommentController..." });
  },
  saveComment: async (req, res) => {
    if (
      req.params.publication != "" &&
      req.params.publication != undefined &&
      req.body.text != "" &&
      req.body.text != undefined
    ) {
      try {
        let publication = await Publication.findById(
          req.params.publication
        ).populate("user");
        if (!publication)
          return res.status(404).send({ message: "Publication not found" });

        if (publication.user.typeAccount != parameters.typeAccount.public) {
          let follow = await Follow.findOne({
            user: req.user,
            followed: publication.user.id,
            toAccept: true
          });
          if (!follow)
            return res.status(403).send({
              message:
                "Forbidden: You don't have permission to access on this user"
            });
        }
        let comment = new Comment();
        comment.publication = req.params.publication;
        comment.user = req.user;
        comment.text = req.body.text;

        let commentStored = await Comment.create(comment);
        if (!commentStored)
          return res.status(404).send({
            message: "Error in the request."
          });

        let commentPopulate = await commentStored
          .populate("user")
          .execPopulate();

        return res
          .status(200)
          .send({ message: "Comment stored", comment: commentPopulate });
      } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Missing arguments or are invalid" });
    }
  },
  updateComment: async (req, res) => {
    if (
      req.params.comment != "" &&
      req.params.comment != undefined &&
      req.body.text != "" &&
      req.body.text != undefined
    ) {
      try {
        let comment = await Comment.findById(req.params.comment);

        let publication = await Publication.findById(
          comment.publication
        ).populate("user");
        if (!publication)
          return res.status(404).send({ message: "Publication not found" });

        if (publication.user.typeAccount != parameters.typeAccount.public) {
          let follow = await Follow.findOne({
            user: req.user,
            followed: publication.user.id,
            toAccept: true
          });
          if (!follow)
            return res.status(403).send({
              message:
                "Forbidden: You don't have permission to access on this user"
            });
        }
        comment.text = req.body.text;

        let commentUpdated = await Comment.findOneAndUpdate(
          { _id: comment.id },
          comment,
          { new: true }
        );
        if (!commentUpdated)
          return res.status(404).send({
            message: "Error in the request."
          });

        return res
          .status(200)
          .send({ message: "Comment updated", comment: commentUpdated });
      } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Missing arguments or are invalid" });
    }
  },
  deleteComment: async (req, res) => {
    if (req.params.comment != "" && req.params.comment != undefined) {
      try {
        let comment = await Comment.findById(req.params.comment);

        let publication = await Publication.findById(
          comment.publication
        ).populate("user");
        if (!publication)
          return res.status(404).send({ message: "Publication not found" });

        if (publication.user.typeAccount != parameters.typeAccount.public) {
          let follow = await Follow.findOne({
            user: req.user,
            followed: publication.user.id,
            toAccept: true
          });
          if (!follow)
            return res.status(403).send({
              message:
                "Forbidden: You don't have permission to access on this user"
            });
        }

        let commentDeleted = await Comment.findOneAndDelete({
          _id: comment.id
        });
        if (!commentDeleted)
          return res.status(404).send({
            message: "Error in the request."
          });

        return res.status(200).send({ message: "Comment deleted" });
      } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Missing arguments or are invalid" });
    }
  },
  getCommentsByPublication: async (req, res) => {
    if (req.params.publication != "" && req.params.publication != undefined) {
      try {
        let publication = await Publication.findById(
          req.params.publication
        ).populate("user");
        if (!publication)
          return res.status(404).send({ message: "Publication not found" });

        if (publication.user.typeAccount != parameters.typeAccount.public) {
          let follow = await Follow.findOne({
            user: req.user,
            followed: publication.user.id,
            toAccept: true
          });
          if (!follow)
            return res.status(403).send({
              message:
                "Forbidden: You don't have permission to access on this user"
            });
        }

        let commentsFound = await Comment.find({
          publication: req.params.publication
        }).populate("user");
        if (!commentsFound)
          return res.status(404).send({
            message: "Error in the request."
          });

        return res
          .status(200)
          .send({ total: commentsFound.length, comments: commentsFound });
      } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Missing arguments or are invalid" });
    }
  }
};

module.exports = commentController;
