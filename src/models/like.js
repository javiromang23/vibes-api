"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  publication: { type: Schema.ObjectId, ref: "Publication", required: true },
  user: { type: Schema.ObjectId, ref: "User", required: true },
  toDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Like", LikeSchema);
