"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");

const app = express();

/* Route Files */
const userRoutes = require("./routes/user");
const followRoutes = require("./routes/follow");
const publicationRoutes = require("./routes/publication");
const likeRoutes = require("./routes/like");
const commentRoutes = require("./routes/comment");
const notificationRoutes = require("./routes/notification");

/** Middlewares **/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multipart());

/** CORS **/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

  next();
});

/** Routes **/
app.use("/api", userRoutes);
app.use("/api", followRoutes);
app.use("/api", publicationRoutes);
app.use("/api", likeRoutes);
app.use("/api", commentRoutes);
app.use("/api", notificationRoutes);

module.exports = app;
