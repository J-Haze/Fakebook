const passport = require("../config/passport");
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
var fs = require("fs");
var path = require("path");
const multer = require("multer");
require("dotenv").config();

// const keys = require("../config/keys");

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
        console.log(user); //Delete at end
        res.json(user);
        next();
      }).populate("friendList");
    }
  });
};

// exports.get_users = (req, res, next) => {
//   User.find((err, users) => {
//     if (err) {
//       console.log(err);
//       return res.json(err);
//     }
//     res.json(users);
//   });
// };

exports.get_users = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      User.find((err, users) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        res.json(users);
      }).populate("friendList");
    }
  });
};

exports.post_create_user = [
  //Validate and sanitize fields.
  body("firstname", "Please enter a first name").not().isEmpty().trim(),
  body("lastname", "Please enter a last name").not().isEmpty().trim(),
  // body("email", "Please enter an email")
  //   .isEmail()
  //   .normalizeEmail()
  //   .not()
  //   .isEmpty()
  //   .trim(),
  body("email", "Please enter an email").isEmail().not().isEmpty().trim(),
  body("password", "Please enter a password").not().isEmpty().trim(),
  body("birthDate", "Please enter a birth date").not().isEmpty().trim(),
  body("gender", "Please enter a gender").not().isEmpty().trim(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // let emailLower = req.body.email.toLowerCase();
    // console.log("emailLower", emailLower)

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
              destination: "uploads/",
              // filename: "1612909792160_default-prof-pic.png",
              filename: "default-prof-pic.png",
              path: "",
              encoded: {
                contentType: "image/png",
                image: "",
              },
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

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // destination: function (req, form, cb) {
    // console.log("internal request", req)
    // console.log("form", form)
    // form
    // console.log("here file0", file);
    cb(null, "uploads/");
    // cb(null, "../../uploads");
    // cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // console.log("here file1", file)
    // cb(null, Date.now() + "-" + file.fieldname);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    // console.log("here file", file)
    const ext = path.extname(file.originalname);
    ext = ext.toLowerCase();
    //must be jpg or png to upload
    // if (ext !== ".jpg" || ext !== ".png") {
    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".gif" &&
      ext !== ".jpeg" &&
      ext !== ".svg" &&
      ext !== ".jpg"
    ) {
      return cb(res.status(400).end("Only images are allowed."));
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage, limits: { fileSize: 5000000 } });

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

        if (req.files.length > 0) {
          console.log("yes file");
          // console.log("req.file2", req.files[0]);

          // console.log("req.files.path", req.files[0].path);

          var img = fs.readFileSync(req.files[0].path);
          var encode_img = img.toString("base64");
          var final_img = {
            contentType: req.files[0].mimetype,
            image: new Buffer.from(encode_img, "base64"),
          };

          const splitName = req.files[0].originalname.split(".");
          const format = splitName[splitName.length - 1];

          console.log("format", format);

          photo = {
            fieldname: req.files[0].fieldname,
            originalname: req.files[0].originalname,
            encoding: req.files[0].encoding,
            mimetype: req.files[0].mimetype,
            destination: req.files[0].destination,
            filename: req.files[0].filename,
            path: fs.readFileSync(
              path.join(__dirname, "../..", "/uploads/" + req.files[0].filename)
            ),
            encoded: final_img,
            contentType: `image/${format}`,
          };
        }

        // const { userid } = req.params;
        // const { title, text } = req.body;

        //Checks if you're an admin
        // User.findOne({ _id: authData._id }, (err, user) => {
        //   if (err) {
        //     console.log(err);
        //     return res.json(err);
        //   }

        // User.findOne({ _id: authData._id }, (err, originalUser) => {
        //   if (err) {
        //     console.log(err);
        //     return res.json(err);
        //   }

        // if (!user.isAdmin) {
        //   //If user isn't an admin, then check if they are the original author
        //   //Verify that edittor is the post author
        //   if (authData._id != originalUser.author_id) {
        //     console.log(
        //       "Cannot edit this post because you are not the post's author or an admin"
        //     );
        //     return res
        //       .status(400)
        //       .json(
        //         "Cannotedit this post because you are not the post's author or an admin"
        //       );
        //   }
        // }
        if (photo == null) {
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
                message: "User created",
                post: updatedUser,
              });
            }
          );
        } else {
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
                message: "User created",
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
    console.log("h1");
    console.log(err);
    if (err || !user) {
      console.log("error or no user");
      console.log("err", err);
      console.log("user", user);
      console.log("info", info);
      return res.json({
        message: "Incorrect Email or Password.",
      });
    }
    if (err) res.send(err);

    User.findOne({ _id: user._id }, (err, user) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      if (!user.isPublished) {
        return res.json({
          message: "This account is no longer available.",
        });
      }
    });

    jwt.sign(
      { _id: user._id, email: user.email },
      //Production:
      // process.env.JWT_SECRET,
      //Local
      keys.secretOrKey,
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
  // console.log(process.env.GUEST_PW)
  // console.log(keys.guest_email);
  req.body.email = keys.guest_email;
  req.body.password = keys.guest_pw;
  passport.authenticate("local", { session: false }, function (
    err,
    user,
    info
  ) {
    console.log("h1");
    console.log(err);
    if (err || !user) {
      console.log("error or no user");
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
      // { _id: user._id, email: process.env.GUEST_EMAIL },
      //Local
      { _id: user._id, email: user.email },

      //Production:
      // process.env.JWT_SECRET,
      //Local
      keys.secretOrKey,
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

exports.unpublish_user = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      // const { body, validationResult, check } = require("express-validator");
      const { userid } = req.params;
      isPublished = false;

      console.log("userid", userid);

      //Checks if you're an admin
      User.findOne({ _id: authData._id }, (err, user) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        console.log("authData._id", authData._id);

        User.findOne({ _id: userid }, (err, originalUser) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          
      Post.updateMany(
        { receiver: authData._id },
        { interacted: true },
        (err, updatedNotifications) => {
          console.log("wow2", updatedNotifications);
          if (err) {
            console.log(err);
            res.sendStatus(403);
          } else {
            return res.json({ "Updated Notifications": updatedNotifications });
          }
        }
      );

          console.log("originalUser", originalUser);

          Post.findOneAndUpdate(
            { _id: postid },
            { isPublished },
            { useFindAndModify: false, new: true },
            (err, updatedPost) => {
              if (err) {
                console.log(err);
                return res.json(err);
              } else {
                res.json(updatedPost);
              }
            }
          );
        });
      });
    }
  });
};

// exports.facebook_callback = (req, res, next) => {
//   passport.authenticate("facebook", { session: false }, function (
//     err,
//     user,
//     info
//   ) {
//     console.log("made it here");
//     if (err || !user) {
//       console.log("error or no user");
//       console.log("err", err);
//       console.log("user", user);
//       console.log("info", info);
//       return res.json({
//         message: "Could not verify Facebook account",
//       });
//     }
//     // if (err) res.send(err);
//     jwt.sign(
//       { _id: user._id, email: user.email },
//       //Production:
//       // process.env.JWT_SECRET,
//       //Local
//       keys.secretOrKey,
//       { expiresIn: 36000 },
//       (err, token) => {
//         if (err) {
//           return res.status(400).json(err);
//         }
//         res.json({
//           token: token,
//           user: { _id: user._id, email: user.email },
//         });
//       }
//     );
//   })(req, res);
// };

// exports.user_logout_get = function (req, res) {
//   req.logOut();
// };

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
      }).populate("author");
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
  }).populate("author");
};

// Dive.update(
//   { _id: diveId },
//   { $pull: { divers: { user: userIdToRemove } } },
//   { safe: true, multi: true },
//   function (err, obj) {
//     //do something smart
//   }
// );

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
        { safe: true },
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
            { safe: true },
            (err, newUser) => {
              if (err) {
                console.log(err);
                return res.json(err);
              }

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
