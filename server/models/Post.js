const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 300 },
    text: { type: String, required: true, maxlength: 10000 },
    author_id: { type: Schema.Types.ObjectId, ref: "User" },
    author: { type: Schema.Types.String, ref: "User" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Post", postSchema);
