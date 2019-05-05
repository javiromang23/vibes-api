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
      return res.status(200).send({ message: "User sent", user: user });
    }).select("-password");
  },
  updateUser: async (req, res) => {
    let user = {};

    /* Email validation */
    if (req.body.email != "" && req.body.email != undefined) {
      if (
        /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(req.body.email)
      ) {
        try {
          let userFound = await User.findOne({ email: req.body.email });
          if (userFound) {
            return res.status(400).send({ message: "Email is not available" });
          }
          user.email = req.body.email;
        } catch (err) {
          return res.status(500).send({ message: `Error server: ${err}` });
        }
      } else {
        return res.status(400).send({ message: "Email is not available" });
      }
    }

    /* Username validation */
    if (req.body.username != "" && req.body.username != undefined) {
      try {
        let userFound = await User.findOne({ username: req.body.username });
        if (userFound) {
          return res.status(400).send({ message: "Username is not available" });
        }
        user.username = req.body.username;
      } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
      }
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
        return res.status(400).send({ message: "Invalid typeAccount" });
      } else {
        user.typeAccount = req.body.typeAccount;
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
        return res.status(400).send({ message: "Invalid sex" });
      } else {
        user.sex = req.body.sex;
      }
    }

    /* Avatar validation */
    if (req.files.avatar != "" && req.files.avatar != undefined) {
      let filePath = req.files.avatar.path;
      let fileSplit = filePath.split("\\");
      let fileName = fileSplit[fileSplit.length - 1];
      let extSplit = fileName.split(".");
      let fileExt = extSplit[1].toLowerCase();

      // Extensions file validation
      if (
        fileExt == "png" ||
        fileExt == "jpg" ||
        fileExt == "jpeg" ||
        fileExt == "gif"
      ) {
        try {
          let folder = path.resolve(
            __dirname +
              "/../../uploads/users/" +
              req.params.username +
              "/avatars/"
          );
          if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
          }
          let newPathFile =
            folder + fileName + path.extname(filePath).toLowerCase();
          fs.rename(filePath, newPathFile, err => {
            if (err) throw err;
          });
          user.avatar = fileName;
        } catch (err) {
          return res.status(500).send({ message: `Error server: ${err}` });
        }
      } else {
        return removeFilesUploads(res, file_path, "Image not valid.");
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
    ).select("-password");
  }
};

module.exports = userController;

function removeFilesUploads(res, file_path, message) {
  fs.unlink(file_path, err => {
    return res.status(400).send({ message: message });
  });
}
