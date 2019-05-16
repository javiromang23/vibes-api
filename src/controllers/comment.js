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

        return res
          .status(200)
          .send({ message: "Comment stored", comment: commentStored });
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
