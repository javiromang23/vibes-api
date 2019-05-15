"use strict";

const express = require("express");
const publicationController = require("../controllers/publication");
const auth = require("../middlewares/auth");
const api = express.Router();

api.get("/test-publication", publicationController.test);
api.post("/publication", auth, publicationController.savePublication);
api.put("/publication/:id", auth, publicationController.uploadPublication);
api.get("/publication/:id", auth, publicationController.getPublication);
api.get(
  "/publications-follows",
  auth,
  publicationController.getPublicationsFollowers
);
api.get(
  "/publications/public/:category?",
  auth,
  publicationController.getPublicationsPublic
);
api.get(
  "/publications/:username",
  auth,
  publicationController.getPublicationsByUser
);
api.delete("/publication/:id", auth, publicationController.deletePublication);

module.exports = api;
