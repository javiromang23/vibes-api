"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true },
  fromUser: { type: Schema.ObjectId, ref: "User", required: true },
  toDate: { type: Date, default: Date.now() },
  message: { type: String, required: true },
  publication: { type: Schema.ObjectId, ref: "Publication" }
});

module.exports = mongoose.model("Notification", NotificationSchema);
