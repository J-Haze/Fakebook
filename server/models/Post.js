const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    image: {type: String, default: ""},
    likesList: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    // author: { type: Schema.Types.String, ref: "User" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Post", postSchema);
