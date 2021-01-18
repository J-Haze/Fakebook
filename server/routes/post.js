const express = require("express");
const router = express.Router();

var post_controller = require("../controllers/post_controller");
var comment_controller = require("../controllers/comment_controller");

const auth = require("../middleware/auth");

// GET - Get all posts
router.get("/", post_controller.get_posts);

// // POST new blog post
router.post("/new", auth, post_controller.post_create_post);

//Get specific post
router.get("/:postid", post_controller.get_post);

//Update specific post
router.put("/:postid", auth, post_controller.edit_post);

//Update specific post
router.put("/:postid", auth, post_controller.edit_post);

//Like a specific post
// router.put("/:postid/like", auth, post_controller.like_post);

//Unlike a specific post
// router.put("/:postid/unlike", auth, post_controller.unlike_post);

//Don't have
// //Publish post
// router.put("/:postid/publish", auth, post_controller.publish_post);

//Unpublish post
router.put("/:postid/unpublish", auth, post_controller.unpublish_post);

//Delete specific post
router.delete("/:postid", auth, post_controller.delete_post);

//Comments

//Post a comment on a post
// router.post("/:postid/comment", auth, comment_controller.post_create_comment);

//Delete a comment
router.delete("/:postid/:commentid", auth, comment_controller.delete_comment);

//Like a comment
// router.put("/:postid/:commentid/like", auth, comment_controller.like_comment);

//Unlike a comment
// router.put("/:postid/:commentid/unlike", auth, comment_controller.unlike_comment);

//Unpublish a comment
router.put(
  "/:postid/:commentid/unpublish",
  auth,
  comment_controller.unpublish_comment
);

// GET - Get comments from specific post
router.get("/:postid/comments", post_controller.get_comments);

module.exports = router;
