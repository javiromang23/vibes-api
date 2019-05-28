"use strict";

const User = require("../models/User");
const Follow = require("../models/Follow");
const Publication = require("../models/Publication");
const Comment = require("../models/Comment");
const Like = require("../models/like");
const serviceJwt = require("../services/jwt");
const parameters = require("../parameters");
const bcrypt = require("bcrypt-nodejs");
const path = require("path");
const fs = require("fs");
const mailer = require("../services/mailer");

const userController = {
  test: (req, res) => {
    res.status(200).send({ message: "Testing userController..." });
  },
  signUp: async (req, res) => {
    if (
      req.body.email != "" &&
      req.body.email != undefined &&
      req.body.username != "" &&
      req.body.username != undefined &&
      req.body.password != "" &&
      req.body.password != undefined &&
      req.body.name != "" &&
      req.body.name != undefined
    ) {
      let regExp = /\s+/g;
      let email = req.body.email.replace(regExp, "");
      let username = req.body.username.replace(regExp, "");

      for (let prop in parameters.reservedWords) {
        if (username.toLowerCase() == prop) {
          return res.status(400).send({ message: "Username is not available" });
        }
      }

      /** Email validation */
      if (
        /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(req.body.email)
      ) {
        try {
          let userFound = await User.findOne({ email: email });
          if (userFound) {
            return res.status(400).send({ message: "Email is not available" });
          }
        } catch (err) {
          return res.status(500).send({ message: `Error server: ${err}` });
        }
      } else {
        return res.status(400).send({ message: "Email not valid" });
      }

      /* Username validation */
      try {
        let userFound = await User.findOne({ username: username });
        if (userFound) {
          return res.status(400).send({ message: "Username is not available" });
        }
      } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
      }

      try {
        let fileDefault = path.resolve(
          __dirname + "/../../uploads/default/default_profile.png"
        );
        let folderNew = path.resolve(
          __dirname + "/../../uploads/users/" + username + "/avatars/"
        );
        if (!fs.existsSync(folderNew)) {
          fs.mkdirSync(folderNew, { recursive: true });
        }
        let newPathFile = path.resolve(folderNew + "/default_profile.png");

        fs.copyFile(fileDefault, newPathFile, err => {
          if (err) throw err;
          console.log("default_profile.png was copied to userFolder");
        });
      } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
      }

      const newUser = new User({
        email: email,
        username: username,
        password: req.body.password,
        name: req.body.name
      });

      newUser.save(err => {
        if (err)
          return res
            .status(500)
            .send({ message: `Error creating the user: ${err}` });

        mailer.sendWelcomeEmail(newUser.email, newUser.username);

        return res.status(200).send({
          token: serviceJwt.createToken(newUser),
          userId: newUser.id
        });
      });
    } else {
      return res
        .status(400)
        .send({ message: "Missing arguments or are invalid" });
    }
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
          token: serviceJwt.createToken(user),
          userId: user.id
        });
      });
    });
  },
  getUserByUsername: async (req, res) => {
    try {
      let userFound = await User.findOne({
        username: req.params.username
      }).select("-password");
      if (!userFound)
        return res.status(404).send({ message: "User not found" });

      if (userFound.typeAccount != "private") {
        return res.status(200).send({ message: "User sent", user: userFound });
      }

      let follow = await Follow.findOne({
        user: req.user,
        followed: userFound.id,
        toAccept: true
      });
      if (!follow) {
        userFound.email = undefined;
        userFound.sex = undefined;
        userFound.website = undefined;
        userFound.signUpDate = undefined;
        userFound.lastLogin = undefined;
      }
      return res.status(200).send({ message: "User sent", user: userFound });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getUserById: async (req, res) => {
    try {
      let userFound = await User.findOne({
        _id: req.params.id
      }).select("-password");
      if (!userFound)
        return res.status(404).send({ message: "User not found" });

      if (userFound.typeAccount != "private") {
        return res.status(200).send({ message: "User sent", user: userFound });
      }

      let follow = await Follow.findOne({
        user: req.user,
        followed: userFound.id,
        toAccept: true
      });
      if (!follow) {
        userFound.email = undefined;
        userFound.sex = undefined;
        userFound.website = undefined;
        userFound.signUpDate = undefined;
        userFound.lastLogin = undefined;
      }
      return res.status(200).send({ message: "User sent", user: userFound });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  updateUser: async (req, res) => {
    let user = {};
    let regExp = /\s+/g;

    /* Email validation */
    if (req.body.email != "" && req.body.email != undefined) {
      if (
        /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(req.body.email)
      ) {
        try {
          let userFound = await User.findOne({ email: req.body.email });
          if (userFound && userFound.id != req.user) {
            return res.status(400).send({ message: "Email is not available" });
          }
          user.email = req.body.email;
        } catch (err) {
          return res.status(500).send({ message: `Error server: ${err}` });
        }
      } else {
        return res.status(400).send({ message: "Email not valid" });
      }
    }

    /* Username validation */
    if (req.body.username != "" && req.body.username != undefined) {
      var username = req.body.username.replace(regExp, "");
      try {
        let userFound = await User.findOne({ username: username });
        if (userFound && userFound.id != req.user) {
          return res.status(400).send({ message: "Username is not available" });
        }
        user.username = username;
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
        req.body.typeAccount.toLowerCase() != parameters.typeAccount.public &&
        req.body.typeAccount.toLowerCase() != parameters.typeAccount.private
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
        req.body.sex.toLowerCase() != parameters.sex.male &&
        req.body.sex.toLowerCase() != parameters.sex.female &&
        req.body.sex.toLowerCase() != parameters.sex.shemale &&
        req.body.sex.toLowerCase() != parameters.sex.other
      ) {
        return res.status(400).send({ message: "Invalid sex" });
      } else {
        user.sex = req.body.sex;
      }
    }

    /* Avatar validation */
    if (req.files != undefined) {
      if (req.files.avatar != "" && req.files.avatar != undefined) {
        let filePath = req.files.avatar.path;
        let fileSplit = filePath.split("\\");
        let fileName = fileSplit[fileSplit.length - 1];
        let extSplit = fileName.split(".");
        let fileExt = extSplit[1].toLowerCase();
        fileName = extSplit[0];

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
            let newPathFile = path.resolve(folder + "/" + fileName);
            fs.rename(filePath, newPathFile + "." + fileExt, err => {
              if (err) throw err;
            });
            user.avatar = fileName + "." + fileExt;
          } catch (err) {
            return res.status(500).send({ message: `Error server: ${err}` });
          }
        } else {
          return removeFilesUploads(res, filePath, "Image not valid.");
        }
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
  },
  deleteUser: async (req, res) => {
    try {
      let userDeleted = await User.deleteOne({ username: req.params.username });
      if (!userDeleted)
        return res.status(404).send({ message: `User not found` });

      let folder = path.resolve(
        __dirname + "/../../uploads/users/" + req.params.username
      );
      deleteFolderRecursive(folder);

      let followers = await Follow.find({ user: req.user })
        .remove()
        .exec();
      let followeds = await Follow.find({ followed: req.user })
        .remove()
        .exec();
      let publications = await Publication.find({ user: req.user })
        .remove()
        .exec();
      let comments = await Comment.find({ user: req.user })
        .remove()
        .exec();
      let likes = await Like.find({ user: req.user })
        .remove()
        .exec();

      return res.status(200).send({ message: `User deleted` });
    } catch (err) {
      return res.status(500).send({ message: `Error server: ${err}` });
    }
  },
  getImageFile: (req, res) => {
    var path_file = path.resolve(
      __dirname +
        "/../../uploads/users/" +
        req.params.username +
        "/avatars/" +
        req.params.imageFile
    );

    fs.exists(path_file, exists => {
      if (exists) {
        res.sendFile(path.resolve(path_file));
      } else {
        res.status(200).send({ message: "No existe la imagen" });
      }
    });
  }
};

module.exports = userController;

function removeFilesUploads(res, file_path, message) {
  fs.unlink(file_path, err => {
    return res.status(400).send({ message: message });
  });
}

function deleteFolderRecursive(path) {
  try {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file) {
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          deleteFolderRecursive(curPath);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  } catch (err) {
    return err;
  }
}
