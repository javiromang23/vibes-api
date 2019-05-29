"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResetPasswordSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true },
  hash: { type: String, required: true },
  toDate: { type: Date, default: Date.now() },
  toExpired: { type: Date, default: Date.now() + 900000 }
});

module.exports = mongoose.model("ResetPassword", ResetPasswordSchema);
