"use strict";

const User = require("../models/User");
const Publication = require("../models/Publication");
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
  uploadPublication: (req, res) => {}
};

module.exports = publicationController;

function removeFilesUploads(res, file_path, message) {
  fs.unlink(file_path, err => {
    return res.status(400).send({ message: message });
  });
}
