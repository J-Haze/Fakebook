const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");
const Request = require("./FriendRequest");

const notificationSchema = mongoose.Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    objectType: { type: String, required: true },
    postObject: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    commentObject: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    requestObject: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
