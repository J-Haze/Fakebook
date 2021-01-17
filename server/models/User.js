const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, minlength: 3, maxlength: 15 },
    password: { type: String, required: true, minlength: 6 },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema); 
