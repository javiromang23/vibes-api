"use strict";

const User = require("../models/User");
const Follow = require("../models/Follow");
const Publication = require("../models/Publication");
const parameters = require("../parameters");
const path = require("path");
const fs = require("fs");

const publicationController = {
  test: async (req, res) => {
    res.status(200).send({ message: "Testing publicationController..." });
  },
  savePublication: async (req, res) => {
    let publication = new Publication();
    publication.user = req.user;

    if (
      req.body.title != "" &&
      req.body.title != undefined &&
      req.body.description != "" &&
      req.body.description != undefined &&
      req.files != undefined &&
      req.files.image != "" &&
      req.files.image != undefined
    ) {
      publication.title = req.body.title;
      publication.description = req.body.description;

      if (req.body.category != "" && req.body.category != undefined) {
        let count = 0;
        let errors = 0;
        for (let prop in parameters.category) {
          count++;
          if (req.body.category.toLowerCase() != prop) {
            errors++;
          }
        }
        if (count == errors) {
          return res.status(400).send({ message: "Category is not available" });
        }
      }

      if (req.body.mentions != "" && req.body.mentions != undefined) {
        let mentionsArray = req.body.mentions.split(";");
        let mentions = await User.find({ _id: mentionsArray });
        if (!mentions)
          return res
            .status(404)
            .send({ message: "The mentioned users do not exist" });

        publication.mentions = mentions;
      }

      let filePath = req.files.image.path;
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
          let user = await User.findById(publication.user);
          if (!user)
            return res.status(404).send({ message: "User not found." });

          let folder = path.resolve(
            __dirname +
              "/../../uploads/users/" +
              user.username +
              "/publications/"
          );
          if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
          }
          let newPathFile = path.resolve(folder + "/" + fileName);
          fs.rename(filePath, newPathFile + "." + fileExt, err => {
            if (err) throw err;
          });
          publication.image = fileName + "." + fileExt;

          let newPublication = await Publication.create(publication);
          if (!newPublication) {
            return res
              .status(401)
              .send({ message: `The publication could not be saved.` });
          }

          return res.status(200).send({
            message: "Stored publication.",
            publication: newPublication
          });
        } catch (err) {
          return res.status(500).send({ message: `Error server: ${err}` });
        }
      } else {
        return removeFilesUploads(res, filePath, "Image not valid.");
      }
    } else {
      return res
        .status(400)
        .send({ message: "Missing arguments or are invalid" });
    }
  },
  updatePublication: (req, res) => {
    let publication = new Publication();

    if (req.body.title != "" && req.body.title != undefined) {
      publication.title = req.body.title;
    }
    if (req.body.description != "" && req.body.description != undefined) {
      publication.description = req.body.description;
    }

    if (req.body.mentions != "" && req.body.mentions != undefined) {
      let mentionsArray = req.body.mentions.split(";");
      let mentions = await User.find({ _id: mentionsArray });
      if (!mentions)
        return res
          .status(404)
          .send({ message: "The mentioned users do not exist" });

      publication.mentions = mentions;
    }

    if (req.body.category != "" && req.body.category != undefined) {
      let count = 0;
      let errors = 0;
      for (let prop in parameters.category) {
        count++;
        if (req.body.category.toLowerCase() != prop) {
          errors++;
        }
      }
      if (count == errors) {
        return res.status(400).send({ message: "Category is not available" });
      }
    }

    Publication.findOneAndUpdate(
      { _id: req.params.id },
      publication,
      { new: true },
      (err, publicationUpdated) => {
        if (err)
          return res.status(500).send({ message: `Error server: ${err}` });
        if (!publicationUpdated) {
          return res.status(404).send({ message: "Publication not found." });
        }
        return res.status(200).send({
          message: "Updated publication",
          publication: publicationUpdated
        });
      }
    );
  },
  getPublication: async (req, res) => {
    try {
      let publicationFound = await Publication.findById({
        _id: req.params.id
      }).populate("user");
      if (!publicationFound)
        return res.status(404).send({ message: "Publication not found." });
      publicationFound.user.password = undefined;
      if (publicationFound.user.typeAccount == "private") {
        let follow = Follow.findOne({
          user: req.user,
          followed: publicationFound.user.id,
          accept: true
        });
        if (!follow)
          return res
            .status(401)
            .send({ message: "This publication is private" });
      }
      return res.status(200).send({
        message: "Publication found.",
        publication: publicationFound
      });
    } catch (err) {
      return res.status(500).send({ message: `Error server: ${err}` });
    }
  },
  getPublicationsByUser: async (req, res) => {
    try {
      let user = await User.findOne({ username: req.params.username });
      if (!user) return res.status(404).send({ message: "User not found." });

      if (user.id != req.user) {
        if (user.typeAccount == "private") {
          let follow = await Follow.findOne({
            user: req.user,
            followed: user.id,
            accept: true
          });
          if (!follow)
            return res
              .status(401)
              .send({ message: "This publications is private" });
        }
      }

      let publications = await Publication.find({ user: user.id });
      return res.status(200).send({
        message: "Publications found.",
        publications: publications
      });
    } catch (err) {
      return res.status(500).send({ message: `Error server: ${err}` });
    }
  },
  deletePublication: async (req, res) => {
    try {
      let publication = await Publication.findById(req.params.id).populate(
        "user"
      );

      if (publication.user.id == req.user) {
        let deleted = await Publication.findByIdAndDelete({
          _id: publication.id
        });
        if (!deleted)
          return res.status(401).send({ message: "Error in the request." });

        let pathFile = path.resolve(
          __dirname +
            "/../../uploads/users/" +
            publication.user.username +
            "/publications/" +
            publication.image
        );
        fs.unlinkSync(pathFile);

        return res.status(200).send({ message: "Deleted publication." });
      } else {
        return res.status(403).send({
          message: "Forbidden: You don't have permission to access on this user"
        });
      }
    } catch (err) {
      return res.status(500).send({ message: `Error server: ${err}` });
    }
  },
  getPublicationsFollowers: async (req, res) => {
    try {
      let followers = [];
      let publications = [];

      let follows = await Follow.find({
        user: req.user,
        toAccept: true
      }).populate("followed");

      follows.forEach(follow => {
        followers.push(follow.followed.id);
      });

      followers.push(req.user);

      let publicationsFound = await Publication.find({
        user: followers
      })
        .populate("user")
        .sort("-createdAt");

      publicationsFound.forEach(publication => {
        publication.user.password = undefined;
        publications.push(publication);
      });

      if (publications.length != 0) {
        return res
          .status(200)
          .send({ total: publications.length, publications: publications });
      }
      return res
        .status(404)
        .send({ message: "There are no existing publications" });
    } catch (err) {
      return res.status(500).send({ message: `Error server: ${err}` });
    }
  },
  getPublicationsPublic: async (req, res) => {
    try {
      let publications;

      let usersPublic = await User.find({
        typeAccount: "public"
      }).select("id");

      let usersFollow = await Follow.find({ user: req.user, toAccept: true })
        .populate("followed")
        .select("followed.id");

      let users = usersPublic.concat(usersFollow);

      if (req.params.category != "" && req.params.category != undefined) {
        let count = 0;
        let errors = 0;
        for (let prop in parameters.category) {
          count++;
          if (req.params.category.toLowerCase() != prop) {
            errors++;
          }
        }
        if (count == errors) {
          return res.status(400).send({ message: "Category is not available" });
        }
        publications = await Publication.find({
          user: users,
          category: req.params.category
        })
          .populate("user")
          .sort("-createdAt");
      } else {
        publications = await Publication.find({
          user: users
        })
          .populate("user")
          .sort("-createdAt");
      }

      if (!publications)
        return res.status(404).send({ message: "Publications not found" });

      return res
        .status(200)
        .send({ total: publications.length, publications: publications });
    } catch (err) {
      return res.status(500).send({ message: `Error server: ${err}` });
    }
  }
};

module.exports = publicationController;

function removeFilesUploads(res, file_path, message) {
  fs.unlink(file_path, err => {
    return res.status(400).send({ message: message });
  });
}
