const passport = require("../config/passport");
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const jwt = require("jsonwebtoken");
// const keys = require("../config/keys");
var fs = require("fs");
var path = require("path");
const multer = require("multer");
require("dotenv").config();

const AWS = require("aws-sdk");

AWS.config.region = "us-west-2";

// AWS
const S3 = new AWS.S3();

var User = require("../models/User");
var Post = require("../models/Post");
var Comment = require("../models/Comment");
var Request = require("../models/FriendRequest");
var Notification = require("../models/Notification");

exports.index = (req, res, next) => {
  res.json("Index");
};

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
      }).populate({ path: "friendList", match: { isPublished: true } });
    }
  });
};

exports.get_users = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      User.find({ isPublished: true }, (err, users) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        res.json(users);
      }).populate({ path: "friendList", match: { isPublished: true } });
    }
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
      bio: "",
      location: "",
      occupation: "",
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
            password: hashed,
            birthDate: req.body.birthDate,
            gender: req.body.gender,
            friendList: [],
            photo: {
              fieldname: "file",
              originalname: "default-prof-pic.png",
              encoding: "7bit",
              mimetype: "image/png",
              destination: `https://justins-fakebook-api.herokuapp.com/uploads/default-prof-pic.png`,
              url: `https://justins-fakebook-api.herokuapp.com/uploads/default-prof-pic.png`,
              filename: "default-prof-pic.png",
              size: 50000,
              contentType: "image/png",
            },
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

// // SET STORAGE
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
//   fileFilter: (req, file, cb) => {
//     let ext = path.extname(file.originalname);
//     ext = ext.toLowerCase();
//     //must be jpg or png to upload
//     // if (ext !== ".jpg" || ext !== ".png") {
//     if (
//       ext !== ".png" &&
//       ext !== ".jpg" &&
//       ext !== ".gif" &&
//       ext !== ".jpeg" &&
//       ext !== ".svg" &&
//       ext !== ".jpg"
//     ) {
//       return cb(res.status(400).end("Only images are allowed."));
//     }
//     cb(null, true);
//   },
// });

// SET STORAGE
var storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, "");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    ext = ext.toLowerCase();
    //must be jpg or png to upload
    // if (ext !== ".jpg" || ext !== ".png") {
    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".gif" &&
      ext !== ".jpeg" &&
      ext !== ".jfif" &&
      ext !== ".svg" &&
      ext !== ".jpg"
    ) {
      return cb(res.status(400).end("Only images are allowed."));
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage, limits: { fileSize: 4000000 } });

exports.edit_current_user = [
  upload.any("file"),
  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        const { body, validationResult, check } = require("express-validator");

        bio = req.body.bio;
        location = req.body.location;
        occupation = req.body.occupation;
        photo = null;

        if (bio == undefined) {
          bio = "";
        }

        if (location == undefined) {
          location = "";
        }

        if (occupation == undefined) {
          occupation = "";
        }

        console.log("bio1", bio);
        console.log("location1", location);
        console.log("occupation1", occupation);

        if (req.files.length > 0) {
          // var img = fs.readFileSync(req.files[0].path);
          // var encode_img = img.toString("base64");
          // var final_img = {
          //   contentType: req.files[0].mimetype,
          //   image: new Buffer.from(encode_img, "base64"),
          // };

          console.log("file1", req.files[1]);

          req.files[0].filename = `${Date.now()}_${req.files[0].originalname}`;

          const splitName = req.files[0].originalname.split(".");
          const format = splitName[splitName.length - 1];

          const s3Params = {
            Bucket: process.env.S3_BUCKET,
            Key: req.files[0].filename,
            Body: req.files[0].buffer,
            ACL: "public-read",
          };

          // photo = {
          //   fieldname: req.files[0].fieldname,
          //   originalname: req.files[0].originalname,
          //   encoding: req.files[0].encoding,
          //   mimetype: req.files[0].mimetype,
          //   destination: req.files[0].destination,
          //   filename: req.files[0].filename,
          //   path: fs.readFileSync(
          //     path.join(__dirname, "../..", "/uploads/" + req.files[0].filename)
          //   ),
          //   encoded: final_img,
          //   contentType: `image/${format}`,
          // };

          S3.upload(s3Params, (err, data) => {
            if (err) {
              console.log(err);
              return res.json(err);
            } else {
              photo = {
                fieldname: req.files[0].fieldname,
                originalname: req.files[0].originalname,
                encoding: req.files[0].encoding,
                mimetype: req.files[0].mimetype,
                destination: data.Location,
                url: `https://${process.env.S3_BUCKET}.s3-us-west-2.amazonaws.com/${req.files[0].filename}`,
                filename: req.files[0].filename,
                // path: fs.readFileSync(
                //   path.join(
                //     __dirname,
                //     "../..",
                //     "/uploads/" + req.files[0].filename
                //   )
                // ),
                // encoded: final_img,
                size: req.files[0].size,
                contentType: `image/${format}`,
              };
              console.log("bio2", bio);
              console.log("location2", location);
              console.log("occupation2", occupation);
              User.findOneAndUpdate(
                { _id: authData._id },
                { bio, location, occupation, photo },
                { useFindAndModify: false, new: true },
                (err, updatedUser) => {
                  if (err) {
                    console.log(err);
                    return res.json(err);
                  }
                  res.json({
                    message: "User updated",
                    post: updatedUser,
                  });
                }
              );
            }
          });
        } else {
          User.findOneAndUpdate(
            { _id: authData._id },
            { bio, location, occupation },
            { useFindAndModify: false, new: true },
            (err, updatedUser) => {
              if (err) {
                console.log(err);
                return res.json(err);
              }
              res.json({
                message: "User updated",
                post: updatedUser,
              });
            }
          );
        }
      }
    });
  },
];

exports.post_user_login = function (req, res, next) {
  passport.authenticate("local", { session: false }, function (
    err,
    user,
    info
  ) {
    if (err || !user) {
      console.log("err", err);
      console.log("user", user);
      console.log("info", info);
      return res.json({
        message: "Incorrect Email or Password.",
      });
    }
    if (err) res.send(err);

    if (!user.isPublished) {
      return res.json({
        message: "This account is no longer available.",
      });
    }

    jwt.sign(
      { _id: user._id, email: user.email },
      //Production:
      process.env.JWT_SECRET,
      //Local
      // keys.secretOrKey,
      { expiresIn: 36000 },
      (err, token) => {
        if (err) {
          return res.status(400).json(err);
        }
        res.json({
          token: token,
          user: { _id: user._id, email: user.email },
        });
      }
    );
  })(req, res);
};

exports.post_guest_login = function (req, res, next) {
  // req.body.email = keys.guest_email;
  // req.body.password = keys.guest_pw;
  req.body.email = process.env.GUEST_EMAIL;
  req.body.password = process.env.GUEST_PW;
  passport.authenticate("local", { session: false }, function (
    err,
    user,
    info
  ) {
    if (err || !user) {
      console.log("err", err);
      console.log("user", user);
      console.log("info", info);
      return res.json({
        message: "Incorrect Email or Password.",
      });
    }
    if (err) res.send(err);
    jwt.sign(
      //Production:
      { _id: user._id, email: process.env.GUEST_EMAIL },
      //Local
      // { _id: user._id, email: user.email },

      //Production:
      process.env.JWT_SECRET,
      //Local
      // keys.secretOrKey,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          return res.status(400).json(err);
        }
        res.json({
          token: token,
          user: { _id: user._id, email: user.email },
        });
      }
    );
  })(req, res);
};

exports.unpublish_user = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { userid } = req.params;

      User.findOne({ _id: userid }, (err, originalUser) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        Post.updateMany(
          { author: userid },
          { isPublished: false },
          (err, unpublishedPosts) => {
            if (err) {
              console.log(err);
              res.sendStatus(403);
            }

            Comment.updateMany(
              { author: userid },
              { isPublished: false },
              (err, unpublishedComments) => {
                if (err) {
                  console.log(err);
                  res.sendStatus(403);
                }

                Notification.updateMany(
                  {
                    $or: [{ sender: userid }, { receiver: userid }],
                  },
                  { isPublished: false },
                  (err, unpublishedNotifications) => {
                    if (err) {
                      console.log(err);
                      res.sendStatus(403);
                    }

                    Request.deleteMany(
                      {
                        $or: [{ sender: userid }, { receiver: userid }],
                      },
                      (err, deletedRequests) => {
                        if (err) {
                          console.log(err);
                          res.sendStatus(403);
                        }

                        User.findOneAndUpdate(
                          { _id: userid },
                          { isPublished: false },
                          { useFindAndModify: false, new: true },
                          (err, unpublishedUser) => {
                            if (err) {
                              console.log(err);
                              return res.json(err);
                            } else {
                              res.json({
                                "Unpublished Posts": unpublishedPosts,
                                "Unpublished Comments": unpublishedComments,
                                "Unpublished Notifications": unpublishedNotifications,
                                "Deleted Requests": deletedRequests,
                                "Unpublished User": unpublishedUser,
                              });
                            }
                          }
                        );
                      }
                    );
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

exports.get_currentUser_posts = (req, res, next) => {
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
      }).populate("author");
    }
  });
};

exports.get_user_posts = (req, res, next) => {
  const { userid } = req.params;
  Post.find({ author_id: userid }, (err, posts) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    res.json(posts);
    next();
  }).populate("author");
};

// Accept friend request
exports.unfriend_user = (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { userid } = req.params;

      //Remove user from currentUser's list
      User.findOneAndUpdate(
        { _id: authData._id },
        {
          $pull: { friendList: userid },
        },
        // { safe: true },
        { useFindAndModify: false, new: true },
        (err, newCurrentUser) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          //Remove currentUser from user's list
          User.findOneAndUpdate(
            { _id: userid },
            {
              $pull: { friendList: authData._id },
            },
            // { safe: true },
            { useFindAndModify: false, new: true },
            (err, newUser) => {
              if (err) {
                console.log(err);
                return res.json(err);
              }

              console.log(
                "worked",
                ("newCurrentUser", newCurrentUser),
                ("newUser", newUser)
              );

              res.json({
                message: "Updated friend lists's",
                newCurrentUser: newCurrentUser,
                newUser: newUser,
              });
            }
          );
        }
      );
    }
  });
};
