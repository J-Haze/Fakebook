const passport = require("../config/passport");
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var User = require("../models/User");
// var Post = require("../models/Post");
var Request = require("../models/FriendRequest");

exports.get_requests = (req, res, next) => {
  Request.find((err, requests) => {
    if (err) return res.json(err);
    res.json(requests);
  })
    .populate("sender")
    .populate("reciever");
};

exports.get_request = (req, res, next) => {
  const { senderid, recieverid } = req.params;

  //Checks for request with correct sender and reciever
  Request.exists(
    { sender: senderid, reciever: recieverid },
    (err, doesExist) => {
      if (err) return res.json(err);
      console.log("exists?", doesExist);

      if (doesExist) {
        Request.findOne(
          { sender: senderid, reciever: recieverid },
          (err, request) => {
            if (err) {
              console.log(err);
              return res.json(err);
            }
            res.json(request);
          }
        )
          .populate("sender")
          .populate("reciever");
      } else {
        //Checks for request with flipped sender and reciever
        Request.exists(
          { sender: recieverid, reciever: senderid },
          (err, doesExist) => {
            if (err) return res.json(err);
            console.log("exists?", doesExist);

            if (doesExist) {
              Request.findOne(
                { sender: recieverid, reciever: senderid },
                (err, request) => {
                  if (err) {
                    console.log(err);
                    return res.json(err);
                  }
                  res.json(request);
                }
              )
                .populate("sender")
                .populate("reciever");
            } else {
              return res.json(false);
            }
          }
        );
      }
    }
  );
};

exports.get_currentUser_requests_received = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      Request.find({ reciever: authData._id }, (err, receivedRequests) => {
        if (err) return res.json(err);
        res.json(receivedRequests);
      })
        .populate("sender")
        .populate("reciever");
    }
  });
};

exports.get_currentUser_requests_sent = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      Request.find({ sender: authData._id }, (err, sentRequests) => {
        if (err) return res.json(err);
        res.json(sentRequests);
      })
        .populate("sender")
        .populate("reciever");
    }
  });
};

exports.send_request = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      Request.exists(
        { sender: authData._id, reciever: req.body.reciever },
        (err, doesExist) => {
          if (err) return res.json(err);
          // console.log("exists?", doesExist);
          if (doesExist) {
            return res.json("Error, request already exists.");
          } else {
            Request.exists(
              { sender: req.body.reciever, reciever: authData._id },
              (err, doesExist) => {
                if (err) return res.json(err);
                // console.log("exists?", doesExist);
                if (doesExist) {
                  return res.json("Error, request already exists.");
                } else {
                  // const { recieverid } = req.params;
                  var request = new Request({
                    sender: authData._id,
                    reciever: req.body.reciever,
                  });

                  // Data from form is valid. Save book.
                  request.save(function (err) {
                    if (err) {
                      console.log("err", err);
                      return res.json(err);
                    }
                    res.json(request);
                  });
                }
              }
            );
          }
        }
      );
    }
  });
};

exports.cancel_request = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { requestid } = req.params;

      Request.findOneAndDelete({ _id: requestid }, (err, deletedRequest) => {
        if (err) return res.json(err);
        res.json(deletedRequest);
        // next();
      });
    }
  });
};

// Accept friend request
exports.accept_request = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { requestid } = req.params;
      Request.findOne({ _id: requestid }, (err, request) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        //Add sender to reciever's friend list

        User.findOneAndUpdate(
          { _id: request.reciever._id },
          {
            $push: { friendList: request.sender._id },
          },
          (err, updatedReciever) => {
            if (err) {
              console.log(err);
              return res.json(err);
            }
            User.findOneAndUpdate(
              { _id: request.sender._id },
              {
                $push: { friendList: request.reciever._id },
              },
              (err, updatedSender) => {
                if (err) {
                  console.log(err);
                  return res.json(err);
                }

                Request.findOneAndDelete(
                  { _id: requestid },
                  (err, deletedRequest) => {
                    if (err) return res.json(err);

                    res.json({
                      message: "Updated friend lists's",
                      reciever: updatedReciever,
                      sender: updatedSender,
                      deletedRequest: deletedRequest,
                    });
                  }
                );
              }
            );
          }
        );
      });
    }
  });
};

// await Friend.findOneAndUpdate(
//   {
//     user: req.params.id,
//     self: req.user.id,
//   },
//   { $set: { status: "accepted" } },
//   { upsert: true, new: true }
// );

// await Friend.findOneAndUpdate(
//   {
//     user: req.user.id,
//     self: req.params.id,
//   },
//   { $set: { status: "accepted" } },
//   { upsert: true, new: true }
// );

// res.json("Friend accepted");
