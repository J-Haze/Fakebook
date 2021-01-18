const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const userSchema = mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, required: true },
    // friendList: { type: Array, required: true },
    friendList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    photo: { type: String, default: "" },
    realFacebookID: { type: String },
    isPublished: { type: Boolean, default: true },
    // isGuest: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
