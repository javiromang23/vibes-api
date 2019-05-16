"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  publication: { type: Schema.ObjectId, ref: "Publication", required: true },
  user: { type: Schema.ObjectId, ref: "User", required: true },
  toDate: { type: Date, default: Date.now() },
  text: { type: String, required: true }
});

module.exports = mongoose.model("Like", CommentSchema);
