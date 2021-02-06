const express = require("express");
const router = express.Router();
const passport = require("passport");

var user_controller = require("../controllers/user_controller");

const auth = require("../middleware/auth");

//Get current user
router.get("/", auth, user_controller.get_current_user);

// //Edit current User
router.put("/", auth, user_controller.edit_current_user);

// //Delete current user
// router.delete("/", auth, user_controller.delete_current_user);

// //Unpublish current user
// router.put("/unpublish", auth, user_controller.unpublish_current_user);

//POST Sign-Up page
router.post("/new", user_controller.post_create_user);

// //POST Log-In
router.post("/log-in", user_controller.post_user_login);

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { session: false })
);
//^^Currently not used

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get("/auth/facebook/callback", user_controller.facebook_callback);

// GET - Get all users
router.get("/users", auth, user_controller.get_users);

// // GET - Get all friends
// router.get("/friends", auth, user_controller.get_friends);

//Get all posts from current user
router.get("/posts", auth, user_controller.get_currentUser_posts);

//Get all posts by specific author
router.get("/:userid/posts", auth, user_controller.get_user_posts);

//Friend someone
// router.put("/:userid/friend", auth, user_controller.friend_user);

//Unfriend someone
// router.put("/:userid/unfriend", auth, user_controller.unfriend_user);

module.exports = router;
