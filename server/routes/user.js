const express = require("express");
const router = express.Router();

var user_controller = require("../controllers/user_controller");

const auth = require("../middleware/auth");

//Get current user
router.get("/", auth, user_controller.get_current_user);

// //Edit current User
// router.put("/", auth, user_controller.edit_current_user);

// //Delete current user
// router.delete("/", auth, user_controller.delete_current_user);

// //Unpublish current user
// router.put("/unpublish", auth, user_controller.unpublish_current_user);

//POST Sign-Up page
router.post("/new", user_controller.post_create_user);

// //POST Log-In
router.post("/log-in", user_controller.post_user_login);

// GET - Get all users
router.get("/users", user_controller.get_users);

// // GET - Get all friends
// router.get("/friends", user_controller.get_friends);

//Get all posts from current user
router.get("/posts", auth, user_controller.get_currentUser_posts);

//Get all posts by specific author
router.get("/:userid/posts", user_controller.get_user_posts);

//Friend someone
// router.put("/:userid/friend", user_controller.friend_user);

//Unfriend someone
// router.put("/:userid/unfriend", user_controller.unfriend_user);

module.exports = router;
