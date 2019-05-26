"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublicationSchema = new Schema({
  /** Required */
  image: { type: String, required: true },
  user: { type: Schema.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now() },
  /** Optional */
  description: { type: String },
  category: { type: String, required: false, default: "none" },
  mentions: { type: [Schema.ObjectId], ref: "User" }
});

module.exports = mongoose.model("Publication", PublicationSchema);
