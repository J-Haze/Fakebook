const express = require("express");
const router = express.Router();
const passport = require("passport");

var user_controller = require("../controllers/user_controller");

const auth = require("../middleware/auth");

//Get current user
router.get("/", auth, user_controller.get_current_user);

// //Edit current User
router.put("/", auth, user_controller.edit_current_user);

//POST Sign-Up page
router.post("/new", user_controller.post_create_user);

// //POST Log-In
router.post("/log-in", user_controller.post_user_login);

// //POST Log-In
router.post("/log-in/guest", user_controller.post_guest_login);

//Delete/Unpublish user
router.put("/:userid/unpublish", auth, user_controller.unpublish_user);

// GET - Get all users
router.get("/users", auth, user_controller.get_users);

//Get all posts from current user
router.get("/posts", auth, user_controller.get_currentUser_posts);

//Get all posts by specific author
router.get("/:userid/posts", auth, user_controller.get_user_posts);

//Unfriend someone
router.put("/:userid/unfriend", auth, user_controller.unfriend_user);

module.exports = router;
