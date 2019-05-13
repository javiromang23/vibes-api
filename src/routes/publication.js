"use strict";

const express = require("express");
const publicationController = require("../controllers/publication");
const auth = require("../middlewares/auth");
const permissions = require("../middlewares/permissions");
const api = express.Router();

api.get("/test-publication", publicationController.test);
api.post("/publication", [auth], publicationController.savePublication);

module.exports = api;
