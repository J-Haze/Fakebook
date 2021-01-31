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
    // friendList: { type: Array, required: true },
    friendList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    photo: { type: String, default: "" },
    realFacebookID: { type: String },
    isPublished: { type: Boolean, default: true },
    // isGuest: { type: Boolean },
  },
  { timestamps: true }
);

//Write a function that unpublishes all posts and comments of this user!

// UserSchema.pre("remove", function () {
//   // delete all posts of this user
//   Post.deleteMany({ user: this._id }, (err, docs) => {
//     if (err) return next(err);
//   });
//   // delete all comments of this user
//   Comment.deleteMany({ user: this._id }, (err, docs) => {
//     if (err) return next(err);
//   });
//   // delete this user form all their friends' list
//   this.friends.forEach((friend) => {
//     friend.update({ $pull: { friends: this._id } }).exec();
//   });
//   return next();
// });

module.exports = mongoose.model("User", userSchema);
