const express = require("express");
const router = express.Router();

var post_controller = require("../controllers/post_controller");

// GET - Get all posts
router.get("/", post_controller.get_posts);

module.exports = router;
