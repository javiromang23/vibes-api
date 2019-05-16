"use strict";

const Follow = require("../models/Follow");
const Publication = require("../models/Publication");
const parameters = require("../parameters");

const commentController = {
  test: (req, res) => {
    res.status(200).send({ message: "Testing CommentController..." });
  }
};

module.exports = commentController;
