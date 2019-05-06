"use strict";

const Follow = require("../models/Follow");
const User = require("../models/User");

const followController = {
  test: (req, res) => {
    res.status(200).send({ message: "Testing followController..." });
  },
  saveFollow: async (req, res) => {
    let follow = new Follow();
    follow.user = req.user;

    try {
      let userFound = await User.findOne({ username: req.body.username });
      if (!userFound) {
        return res.status(404).send({ message: "User not found" });
      }

      follow.followed = userFound.id;
      if (userFound.typeAccount != "private") {
        follow.toAccept = true;
      } else {
        follow.toAccept = false;
      }

      let duplicated = await Follow.findOne({
        user: follow.user,
        followed: follow.followed
      });

      if (duplicated) {
        return res
          .status(404)
          .send({ message: "The follower can not be duplicated" });
      }

      let followStored = await Follow.create(follow);
      if (!followStored) {
        return res
          .status(404)
          .send({ message: "The follower could not be saved" });
      }
      return res.status(200).send({ message: followStored });
    } catch (err) {
      return res.status(500).send({ message: `Error server: ${err}` });
    }
  },
  acceptFollow: async (req, res) => {
    try {
      let userFound = await User.findOne({ username: req.body.username });
      if (!userFound) {
        return res.status(404).send({ message: "User not found" });
      }
      let followUpdated = await Follow.findOneAndUpdate(
        {
          user: userFound.id,
          followed: req.user
        },
        { toAccept: true },
        { new: true }
      );
      if (!followUpdated) {
        return res
          .status(404)
          .send({ message: "The request could not be accepted" });
      }
      return res.status(200).send({ message: followUpdated });
    } catch (err) {
      return res.status(500).send({ message: `Error server: ${err}` });
    }
  },
  unFollow: async (req, res) => {
    try {
      let userFound = await User.findOne({ username: req.body.username });
      if (!userFound) {
        res.status(404).send({ message: "User not found" });
      }

      let followDeleted = await Follow.findOneAndDelete({
        user: req.user,
        followed: userFound.id
      });
      if (!followDeleted) {
        res.status(404).send({ message: "The request could not be accepted" });
      }
      return res.status(200).send({ message: "Unfollow done" });
    } catch (err) {
      return res.status(500).send({ message: `Error server: ${err}` });
    }
  }
};

module.exports = followController;
