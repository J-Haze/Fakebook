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

exports.send_request = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
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
  });
};

exports.cancel_request = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { requestid } = req.params;

      Post.findOneAndDelete({ _id: requestid }, (err, deletedRequest) => {
        if (err) return res.json(err);
        res.json(deletedRequest);
        // next();
      });
    }
  });
};
