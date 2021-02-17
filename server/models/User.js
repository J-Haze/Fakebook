const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const Comment = require("./Comment");

const userSchema = mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, required: true },
    friendList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    realFacebookID: { type: String },
    isPublished: { type: Boolean, default: true },
    photo: { type: Object },
    bio: { type: String, required: false },
    location: { type: String, required: false },
    occupation: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
