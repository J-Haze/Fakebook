const express = require("express");
const router = express.Router();

var request_controller = require("../controllers/request_controller");

const auth = require("../middleware/auth");

// GET - Get all recieved request
// router.get("/", request_controller.get_currentUser_requests_recieved);

// GET - Get all requests
// router.get("/all", request_controller.get_requests);

// GET - Get all sent requests
// router.get("/sent", request_controller.get_currentUser_requests_sent);

// Send friend request from current user to specified user
// router.post("/:recieverid", request_controller.send_request);

// Accept a friend request
// router.post("/:requestid/accept", request_controller.accept_request);

// Accept a friend request
// router.post("/:requestid/decline", request_controller.decline_request);


module.exports = router;
