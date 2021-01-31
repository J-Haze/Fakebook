const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./User");

const postSchema = mongoose.Schema(
  {
    text: { type: String },
    // image: { type: String, default: "" },
    // image: {
    //   contentType: String,
    //   data: Buffer,
    // },
    image: { type: Object },
    likesList: [{ type: Schema.Types.ObjectId, ref: "User"}],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    // author: { type: Schema.Types.String, ref: "User" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
