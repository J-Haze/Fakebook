const express = require("express");
const router = express.Router();

var request_controller = require("../controllers/request_controller");

const auth = require("../middleware/auth");

// GET - Get all requests
router.get("/all", auth, request_controller.get_requests);

// Check if there is a request pending
router.get("/:senderid/:recieverid", auth, request_controller.get_request);

// GET - Get all recieved request
// router.get("/", auth, request_controller.get_currentUser_requests_recieved);

// GET - Get all sent requests
// router.get("/sent", auth, request_controller.get_currentUser_requests_sent);

// Send friend request from current user to specified user
router.post("/", auth, request_controller.send_request);

// Cancel/Delete a sent friend request
router.delete("/:requestid", auth, request_controller.cancel_request);

// Accept a friend request
router.post("/:requestid/accept", auth, request_controller.accept_request);

// Decline a friend request
// router.post("/:requestid/decline", auth, request_controller.decline_request);

module.exports = router;
