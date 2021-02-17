const express = require("express");
const router = express.Router();

var notification_controller = require("../controllers/notification_controller");

const auth = require("../middleware/auth");

// GET - Get all received request
router.get(
  "/received",
  auth,
  notification_controller.get_currentUser_notifications_received
);

// Send a notification to a specified user
router.post("/", auth, notification_controller.send_notification);

//Change all of specific user's notifications to "seen"
router.put("/see", auth, notification_controller.see_all_notifications);

// //Change specific notification to "interacted"
router.put(
  "/:notificationid/interact",
  auth,
  notification_controller.interact_notification
);

//Change all of specific user's notifications to "interacted"
router.put(
  "/interact/all",
  auth,
  notification_controller.interact_all_notifications
);

module.exports = router;
