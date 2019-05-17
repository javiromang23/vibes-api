"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true },
  toDate: { type: Date, default: Date.now() },
  html: { type: String, required: true }
});

module.exports = mongoose.model("Notification", NotificationSchema);
