const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./User");

const friendRequestSchema = mongoose.Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reciever: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
