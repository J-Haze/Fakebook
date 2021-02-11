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
