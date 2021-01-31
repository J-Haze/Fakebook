const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Post"},
    author: { type: Schema.Types.ObjectId, ref: "User"},
    likesList: [{ type: Schema.Types.ObjectId, ref: "User"}],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
