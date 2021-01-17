const express = require("express");
const router = express.Router();

var user_controller = require("../controllers/user_controller");

const auth = require("../middleware/auth");

router.get("/", auth, user_controller.get_current_user);

// GET - Get all users
router.get("/users", user_controller.get_users);

//POST Sign-Up page
router.post("/new", user_controller.post_create_user);

// //POST Log-In
router.post("/log-in", user_controller.post_user_login);

//Get all posts from current user
router.get("/posts", auth, user_controller.get_currentUser_posts);

//Get all posts by specific author
router.get("/:userid/posts", user_controller.get_user_posts);

module.exports = router;
