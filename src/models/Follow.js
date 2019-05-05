"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true },
  followed: { type: Schema.ObjectId, ref: "User", required: true },
  toAccept: { type: Boolean, required: true }
});

module.exports = mongoose.model("Follow", FollowSchema);
