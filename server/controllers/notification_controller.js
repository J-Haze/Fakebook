const { body, validationResult, check } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var Comment = require("../models/Comment");
var Notification = require("../models/Notification");

exports.get_currentUser_notifications_received = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      Notification.find(
        { receiver: authData._id, isPublished: true },
        (err, receivedNotifications) => {
          if (err) return res.json(err);
          res.json(receivedNotifications);
        }
      )
        .populate("sender")
        .populate("receiver");
    }
  });
};

exports.send_notification = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { receiverid } = req.params;

      if (req.body.receiver === authData._id) {
        return res.json("Sender same as receiver");
      }

      if (req.body.objectType == "comment" && req.body.action == "like") {
        Comment.findOne({ _id: req.body.objectId }, (err, foundComment) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          var notification = new Notification({
            sender: authData._id,
            receiver: req.body.receiver,
            action: req.body.action,
            objectType: req.body.objectType,
            objectId: req.body.objectId,
            parentId: foundComment.parent._id,
            seen: false,
            interacted: false,
            isPublished: true,
          });
          notification.save(function (err) {
            if (err) {
              console.log("err", err);
              return res.json(err);
            }
            res.json(notification);
          });
        });
      } else if (
        req.body.objectType == "comment" &&
        req.body.action == "comment"
      ) {
        var notification = new Notification({
          sender: authData._id,
          receiver: req.body.receiver,
          action: req.body.action,
          objectType: req.body.objectType,
          objectId: req.body.objectId,
          parentId: req.body.parentId,
          seen: false,
          interacted: false,
          isPublished: true,
        });

        notification.save(function (err) {
          if (err) {
            console.log("err", err);
            return res.json(err);
          }
          res.json(notification);
        });
      } else {
        var notification = new Notification({
          sender: authData._id,
          receiver: req.body.receiver,
          action: req.body.action,
          objectType: req.body.objectType,
          objectId: req.body.objectId,
          parentId: req.body.parentId,
          seen: false,
          interacted: false,
          isPublished: true,
        });

        notification.save(function (err) {
          if (err) {
            console.log("err", err);
            return res.json(err);
          }
          res.json(notification);
        });
      }
    }
  });
};

exports.see_all_notifications = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      Notification.updateMany(
        { receiver: authData._id },
        { seen: true },
        (err, updatedNotifications) => {
          if (err) {
            console.log(err);
            res.sendStatus(403);
          } else {
            return res.json({ "Updated Notifications": updatedNotifications });
          }
        }
      );
    }
  });
};

exports.interact_notification = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      interacted = true;
      Notification.findOneAndUpdate(
        { _id: req.params.notificationid },
        { interacted },
        { useFindAndModify: false, new: true },
        (err, updatedNotification) => {
          if (err) {
            console.log(err);
            return res.json(err);
          } else {
            return res.json({
              "Updated Notifications": updatedNotification,
            });
          }
        }
      );
    }
  });
};

exports.interact_all_notifications = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      Notification.updateMany(
        { receiver: authData._id },
        { interacted: true },
        (err, updatedNotifications) => {
          if (err) {
            console.log(err);
            res.sendStatus(403);
          } else {
            return res.json({ "Updated Notifications": updatedNotifications });
          }
        }
      );
    }
  });
};
