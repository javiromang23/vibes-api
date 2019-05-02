"use strict";

const mongoose = require("mongoose");
const app = require("./src/app");
const config = require("./src/config");

mongoose.connect(
  config.db,
  { useCreateIndex: true, useNewUrlParser: true },
  (err, res) => {
    if (err) {
      return console.log(`Error establishing a database connection: ${err}`);
    }
    console.log("Connection to the established database.");

    app.listen(config.port, () => {
      console.log(`Vibes API run to http://localhost:${config.port}`);
    });
  }
);
