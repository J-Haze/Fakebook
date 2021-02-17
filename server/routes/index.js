const express = require("express");
const router = express.Router();

var user_controller = require("../controllers/user_controller");

// GET - Get all posts
router.get("/", user_controller.index);

module.exports = router;
