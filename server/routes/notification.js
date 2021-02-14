const express = require("express");
const router = express.Router();

var notification_controller = require("../controllers/notification_controller");

const auth = require("../middleware/auth");

// GET - Get all requests
// router.get("/all", auth, request_controller.get_requests);

// Check if there is a request pending
// router.get("/:senderid/:receiverid", auth, request_controller.get_request);

// GET - Get all received request
router.get(
  "/received",
  auth,
  notification_controller.get_currentUser_notifications_received
);

// Send a notification to a specified user
router.post("/", auth, notification_controller.send_notification);

// GET - Get all sent requests
// router.get("/sent", auth, request_controller.get_currentUser_requests_sent);

// // Send friend request from current user to specified user
// router.post("/", auth, request_controller.send_request);

// // Cancel/Delete a sent friend request
// router.delete("/:requestid", auth, request_controller.cancel_request);

// // Accept a friend request
// router.post("/:requestid/accept", auth, request_controller.accept_request);

// Decline a friend request
// router.post("/:requestid/decline", auth, request_controller.decline_request);

module.exports = router;
