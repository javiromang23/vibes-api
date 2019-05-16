"use strict";

const User = require("../models/User");
const Follow = require("../models/Follow");
const Publication = require("../models/Publication");
const Like = require("../models/like");
const parameters = require("../parameters");

const publicationController = {
  test: (req, res) => {
    res.status(200).send({ message: "Testing likeController..." });
  },
  saveLike: async (req, res) => {
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

        let like = new Like();
        like.user = req.user;
        like.publication = publication.id;

        let likeStored = await Like.create(like);
        if (!likeStored)
          return res.status(404).send({ message: "Error in the request." });

        return res
          .status(200)
          .send({ message: "Like stored", like: likeStored });
      } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Missing arguments or are invalid" });
    }
  },
  deleteLike: async (req, res) => {
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

        let likeDeleted = await Like.findOneAndDelete({
          user: req.user,
          publication: req.params.publication
        });
        if (!likeDeleted)
          return res.status(404).send({ message: "Error in the request." });

        return res
          .status(200)
          .send({ message: "Deleted like", like: likeDeleted });
      } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Missing arguments or are invalid" });
    }
  },
  getLikeByPublication: async (req, res) => {
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

        let likeFound = await Like.findOne({
          user: req.user,
          publication: req.params.publication
        });
        if (!likeFound)
          return res.status(404).send({ message: "Like not found" });

        return res.status(200).send({ message: "Like found", like: likeFound });
      } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Missing arguments or are invalid" });
    }
  },
  getLikesByPublication: async (req, res) => {
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

        let likesFound = await Like.find({
          publication: req.params.publication
        });
        if (!likesFound)
          return res.status(404).send({ message: "Like not found" });

        return res
          .status(200)
          .send({ total: likesFound.length, Likes: likesFound });
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

module.exports = publicationController;
