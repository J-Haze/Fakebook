const express = require("express");
const router = express.Router();

router.get("/", auth, post_controller.get_posts);

var post_controller = require("../controllers/post_controller");

const auth = require("../middleware/auth");

// GET - Get all posts
router.get("/", auth, post_controller.get_posts);

module.exports = router;
