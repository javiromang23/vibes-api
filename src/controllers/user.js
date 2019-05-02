"use strict";

const User = require("../models/User");
const serviceJwt = require("../services/jwt");
const bcrypt = require("bcrypt-nodejs");
const path = require("path");
const fs = require("fs");

const userController = {
  test: (req, res) => {
    res.status(200).send({ message: "Testing userController..." });
  },
  signUp: (req, res) => {
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      name: req.body.name
    });

    newUser.save(err => {
      if (err)
        return res
          .status(500)
          .send({ message: `Error creating the user: ${err}` });

      return res.status(201).send({ token: serviceJwt.createToken(newUser) });
    });
  },
  signIn: (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) return res.status(500).send({ message: err });
      if (!user)
        return res
          .status(404)
          .send({ message: "Incorrect username or password" });

      bcrypt.compare(req.body.password, user.password, (err, check) => {
        if (!check)
          return res
            .status(404)
            .send({ message: "Incorrect username or password" });

        res.status(200).send({
          message: "Correct login",
          token: serviceJwt.createToken(user)
        });
      });
    });
  },
  getUser: (req, res) => {
    User.findOne({ username: req.params.username }, (err, user) => {
      if (err) return res.status(500).send({ message: err });
      if (!user) return res.status(404).send({ message: "User not found" });
      user.password = undefined;
      return res.status(200).send({ message: "User sent", user: user });
    });
  },
  updateUser: (req, res) => {
    let user = new User();

    /* Permissions validation */
    User.findOne({ username: req.params.username }, (err, userSelected) => {
      if (err) return res.status(500).send({ message: err });
      if (userSelected) {
        if (req.user != userSelected._id) {
          return res.status(403).send({
            message:
              "Forbidden: You don't have permission to access on this user"
          });
        }
      }
    });

    /* Email validation */
    if (req.body.email != "" && req.body.email != undefined) {
      if (
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/.test(
          req.body.email
        )
      ) {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (err) return res.status(500).send({ message: err });
          if (user)
            return res.status(400).send({ message: "Email is not available" });
          user.email = email;
        });
      } else {
        return res.status(400).send({ message: "Email is not available" });
      }
    }

    /* Username validation */
    if (req.body.username != "" && req.body.username != undefined) {
      User.findOne({ username: req.body.username }, (err, user) => {
        if (err) return res.status(500).send({ message: err });
        if (user)
          return res.status(400).send({ message: "Username is not available" });
        user.username = req.body.email;
      });
    }

    /* Name validation */
    if (req.body.name != "" && req.body.name != undefined) {
      user.name = req.body.name;
    }

    /* Password validation */
    if (req.body.password != "" && req.body.password != undefined) {
      user.password = req.body.password;
    }

    /* TypeAccount validation */
    if (req.body.typeAccount != "" && req.body.typeAccount != undefined) {
      if (
        req.body.typeAccount.toLowerCase() != "public" &&
        req.body.typeAccount.toLowerCase() != "private"
      ) {
        user.typeAccount = req.body.typeAccount;
      } else {
        return res.status(400).send({ message: "Invalid typeAccount" });
      }
    }

    /* Website validation */
    if (req.body.website != "" && req.body.website != undefined) {
      if (
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
          req.body.website
        )
      ) {
        user.website = req.body.website;
      } else {
        return res.status(400).send({ message: "Invalid website" });
      }
    }

    /* Bio validation */
    if (req.body.bio != "" && req.body.bio != undefined) {
      user.bio = req.body.bio;
    }

    /* Sex validation */
    if (req.body.sex != "" && req.body.sex != undefined) {
      if (
        req.body.sex.toLowerCase() != "male" &&
        req.body.sex.toLowerCase() != "female" &&
        req.body.sex.toLowerCase() != "shemale" &&
        req.body.sex.toLowerCase() != "other"
      ) {
        user.sex = req.body.sex;
      } else {
        return res.status(400).send({ message: "Invalid sex" });
      }
    }

    /* Avatar validation */
    if (req.files.avatar != "" && req.files.avatar != undefined) {
      var filePath = req.files.avatar.path;
      var fileSplit = filePath.split("\\");
      var fileName = fileSplit[fileSplit.length - 1];
      var extSplit = fileName.split(".");
      var fileExt = extSplit[1];

      // Extensions file validation
      if (
        fileExt == "png" ||
        fileExt == "jpg" ||
        fileExt == "jpeg" ||
        fileExt == "gif"
      ) {
        user.avatar = fileName;
      } else {
        return removeFilesUploads(res, file_path, "Imágen no válida");
      }
    }

    User.findOneAndUpdate(
      { username: req.params.username },
      user,
      { new: true },
      (err, userUpdated) => {
        if (err) return res.status(500).send({ message: err });
        if (!userUpdated)
          return res.status(404).send({
            message: "User not found"
          });

        return res.status(200).send({ user: userUpdated });
      }
    );
  }
};

module.exports = userController;
