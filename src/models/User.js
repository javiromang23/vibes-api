"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");

const UserSchema = new Schema({
  /** Required */
  email: { type: String, unique: true, lowercase: true, required: true },
  username: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  typeAccount: { type: String, required: true, default: "public" },
  signUpDate: { type: Date, default: Date.now() },
  avatar: { type: String, default: "default_profile.png" },
  /** Optional */
  lastLogin: Date,
  website: String,
  bio: String,
  sex: { type: String, lowercase: true }
});

UserSchema.pre("save", function(next) {
  let user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next();

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
