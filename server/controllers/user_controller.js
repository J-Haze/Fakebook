const passport = require("../config/passport");
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var User = require("../models/User");
var Post = require("../models/Post");

exports.get_current_user = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      User.findOne({ _id: authData._id }, (err, user) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        res.json(user);
        next();
      });
    }
  });
};

exports.get_users = (req, res, next) => {
  User.find((err, users) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    res.json(users);
  });
};

exports.get_create_user = function (req, res, next) {
  res.json({
    message: "Get Sign Up Form",
  });
};

exports.post_create_user = [
  //Validate and sanitize fields.
  body("firstname", "Please enter a first name").not().isEmpty().trim(),
  body("lastname", "Please enter a last name").not().isEmpty().trim(),
  body("email", "Please enter an email").isEmail().not().isEmpty().trim(),
  body("password", "Please enter a password").not().isEmpty().trim(),
  body("birthDate", "Please enter a birth date").not().isEmpty().trim(),
  body("gender", "Please enter a gender").not().isEmpty().trim(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a User object with escaped and trimmed data.
    var user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      birthDate: req.body.birthDate,
      gender: req.body.gender,
      friendList: [],
      photo: "",
      realFacebookID: "",
      isPublished: true,
    });

    const checkUser = await User.findOne({
      email: user.email,
    });

    if (!errors.isEmpty()) {
      console.log(errors);
      return;
    } else {
      // Check if email is available
      if (checkUser) {
        console.log("There is already an account associated with this email.");
        return res.json({
          message: "There is already an account associated with this email.",
        });
      } else {
        //Username not taken
        //Hash Password
        await bcrypt.hash(user.password, 10, (err, hashed) => {
          if (err) {
            console.log("Hashing error");
            return next(err);
          }
          //Create new user with hashed password
          var user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            birthDate: req.body.birthDate,
            gender: req.body.gender,
            friendList: [],
            photo: "",
            realFacebookID: "",
            isPublished: true,
          });

          user.save(function (err) {
            if (err) {
              console.log("Saving error");
              console.log(err);
              return next(err);
            } else {
              res.json("Submitted");
            }
          });
        });
      }
    }
  },
];

//login
exports.get_user_login = function (req, res) {
  res.json({
    message: "Get Log-in Form",
  });
};

exports.post_user_login = function (req, res, next) {
  passport.authenticate("local", { session: false }, function (
    err,
    user,
    info
  ) {
    console.log(err);
    if (err || !user) {
      console.log("error or no user");
      return res.json({
        message: "Incorrect Username or Password.",
      });
    }
    if (err) res.send(err);
    jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {
          return res.status(400).json(err);
        }
        res.json({
          token: token,
          user: { _id: user._id, username: user.username },
        });
      }
    );
  })(req, res);
};

exports.user_logout_get = function (req, res) {
  req.logOut();
};

exports.get_currentUser_posts = (req, res, next) => {
  const { body, validationResult, check } = require("express-validator");

  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      Post.find({ author_id: authData._id }, (err, posts) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        res.json(posts);
        next();
      });
    }
  });
};

exports.get_user_posts = (req, res, next) => {
  const { body, validationResult, check } = require("express-validator");
  const { userid } = req.params;
  Post.find({ author_id: userid }, (err, posts) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    res.json(posts);
    next();
  });
};
