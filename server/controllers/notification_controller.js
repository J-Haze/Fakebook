const passport = require("../config/passport");
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var User = require("../models/User");
// var Post = require("../models/Post");
// var Request = require("../models/FriendRequest");
var Comment = require("../models/Comment");
var Notification = require("../models/Notification");

// exports.get_requests = (req, res, next) => {
//   Request.find((err, requests) => {
//     if (err) return res.json(err);
//     res.json(requests);
//   })
//     .populate("sender")
//     .populate("receiver");
// };

// exports.get_request = (req, res, next) => {
//   const { senderid, receiverid } = req.params;

//   //Checks for request with correct sender and receiver
//   Request.exists(
//     { sender: senderid, receiver: receiverid },
//     (err, doesExist) => {
//       if (err) return res.json(err);
//       console.log("exists?", doesExist);

//       if (doesExist) {
//         Request.findOne(
//           { sender: senderid, receiver: receiverid },
//           (err, request) => {
//             if (err) {
//               console.log(err);
//               return res.json(err);
//             }
//             res.json(request);
//           }
//         )
//           .populate("sender")
//           .populate("receiver");
//       } else {
//         //Checks for request with flipped sender and receiver
//         Request.exists(
//           { sender: receiverid, receiver: senderid },
//           (err, doesExist) => {
//             if (err) return res.json(err);
//             console.log("exists?", doesExist);

//             if (doesExist) {
//               Request.findOne(
//                 { sender: receiverid, receiver: senderid },
//                 (err, request) => {
//                   if (err) {
//                     console.log(err);
//                     return res.json(err);
//                   }
//                   res.json(request);
//                 }
//               )
//                 .populate("sender")
//                 .populate("receiver");
//             } else {
//               return res.json(false);
//             }
//           }
//         );
//       }
//     }
//   );
// };

exports.get_currentUser_notifications_received = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      Notification.find(
        { receiver: authData._id },
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
      // const { receiverid } = req.params;

      if ((req.body.objectType == "comment") && req.body.action == "like") {
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
          });
          notification.save(function (err) {
            if (err) {
              console.log("err", err);
              return res.json(err);
            }
            res.json(notification);
          });
        });
      } else if ((req.body.objectType == "comment") && req.body.action == "comment") {
        var notification = new Notification({
          sender: authData._id,
          receiver: req.body.receiver,
          action: req.body.action,
          objectType: req.body.objectType,
          objectId: req.body.objectId,
          parentId: req.body.parentId,
          seen: false,
          interacted: false,
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

// exports.get_currentUser_requests_sent = (req, res, next) => {
//   jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
//     if (err) {
//       console.log(err);
//       res.sendStatus(403);
//     } else {
//       Request.find({ sender: authData._id }, (err, sentRequests) => {
//         if (err) return res.json(err);
//         res.json(sentRequests);
//       })
//         .populate("sender")
//         .populate("receiver");
//     }
//   });
// };

// exports.cancel_request = (req, res) => {
//   jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
//     if (err) {
//       console.log(err);
//       res.sendStatus(403);
//     } else {
//       const { requestid } = req.params;

//       Request.findOneAndDelete({ _id: requestid }, (err, deletedRequest) => {
//         if (err) return res.json(err);
//         res.json(deletedRequest);
//         // next();
//       });
//     }
//   });
// };

// // Accept friend request
// exports.accept_request = (req, res) => {
//   jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
//     if (err) {
//       console.log(err);
//       res.sendStatus(403);
//     } else {
//       const { requestid } = req.params;
//       Request.findOne({ _id: requestid }, (err, request) => {
//         if (err) {
//           console.log(err);
//           return res.json(err);
//         }

//         //Add sender to receiver's friend list

//         User.findOneAndUpdate(
//           { _id: request.receiver._id },
//           {
//             $push: { friendList: request.sender._id },
//           },
//           (err, updatedReceiver) => {
//             if (err) {
//               console.log(err);
//               return res.json(err);
//             }
//             User.findOneAndUpdate(
//               { _id: request.sender._id },
//               {
//                 $push: { friendList: request.receiver._id },
//               },
//               (err, updatedSender) => {
//                 if (err) {
//                   console.log(err);
//                   return res.json(err);
//                 }

//                 Request.findOneAndDelete(
//                   { _id: requestid },
//                   (err, deletedRequest) => {
//                     if (err) return res.json(err);

//                     res.json({
//                       message: "Updated friend lists's",
//                       receiver: updatedReceiver,
//                       sender: updatedSender,
//                       deletedRequest: deletedRequest,
//                     });
//                   }
//                 );
//               }
//             );
//           }
//         );
//       });
//     }
//   });
// };
