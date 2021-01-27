const passport = require("../config/passport");
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const jwt = require("jsonwebtoken");
var fs = require("fs");
var path = require("path");
// const multer = require("multer");
require("dotenv").config();

var User = require("../models/User");
var Post = require("../models/Post");
var Comment = require("../models/Comment");

exports.get_posts = (req, res, next) => {
  Post.find((err, posts) => {
    if (err) return res.json(err);
    res.json(posts);
  });
};

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: 5 * 1024 * 1024,
// }).single("image");

var multer = require("multer");

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });

// var upload = multer({ storage: storage });

// var image = mongoose.model("image", imgSchema);

// // Create storage engine
// const storage = new GridFsStorage({
//   url: mongoURI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err)
//         }
//         const filename = file.originalname
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads',
//         }
//         resolve(fileInfo)
//       })
//     })
//   },
// })

// const upload = multer({ storage })

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // destination: function (req, form, cb) {
    // console.log("internal request", req)
    // console.log("form", form)
    // form
    console.log("here file0", file);
    cb(null, "uploads/");
    // cb(null, "../../uploads");
    // cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    console.log("here file1", file)
    cb(null, Date.now() + "-" + file.fieldname);
  },
  fileFilter: (req, file, cb) => {
    console.log("here file", file)
    const ext = path.extname(file.originalname);
    //must be jpg or png to upload
    if (ext !== ".jpg" || ext !== ".png") {
      return cb(res.status(400).end("only jpg, png are allowed"), false);
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage, limits: { fileSize: 1000000 } });



exports.post_create_post = [
  // Validate and sanitize fields.
  // body("text", "Can't submit a blank post").not().isEmpty().trim(),
  // Add image thing later
  // body("timestamp").escape(),

  upload.single('file'),
  (req, res) => {
    console.log("blah", req)
    console.log("try", req.body)
    console.log("token", req.token)
     if (req.file) {
      console.log("req.file", req.file)
    }
    
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        // console.log("req", req)
        // upload(req, res, (err) => {
        // console.log("request:", req);
        console.log("request body:", req.body);
        console.log("req.body.text", req.body.text)
        console.log("req.body.image", req.body.image)
        console.log("authdata", authData)

        if (req.body.image) {
          console.log("yes image");

          // var img = fs.readFileSync(req.file.path);
          // var encode_img = img.toString("base64");
          // var final_img = {
          //   contentType: req.file.mimetype,
          //   image: new Buffer(encode_img, "base64"),
          // };

          var post = new Post({
            text: req.body.text,
            // image: {
            //   data: fs.readFileSync(
            //     // path.join(__dirname + "/uploads/" + req.file.filename)
            //     path.join(__dirname + "/uploads/" + format)
            //   ),
            //   contentType: "image/png",
            // },
            image: {
              data: fs.readFileSync(
                // path.join(__dirname + "/uploads/" + req.file.filename)
                path.join(__dirname + "/uploads/" + req.body.image)
              ),
              contentType: "image/png",
            },
            likesList: [],
            author: authData._id,
            isPublished: true,
          });
        } else {
          console.log("no image");
          var post = new Post({
            text: req.body.text,
            image: {
              data: "",
              contentType: "",
            },
            likesList: [],
            author: authData._id,
            isPublished: true,
          });
        }
        
        post.save(function (err) {
          if (err) {
            console.log(err);
            return err;
          }
          res.json({
            message: "Post created",
            post: post,
          });
        });
      }
    })
  }
]

exports.get_post = (req, res, next) => {
  const { body, validationResult, check } = require("express-validator");

  const { postid } = req.params;

  Post.findOne({ _id: postid }, (err, post) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    Comment.find({ parent: postid }, (err, postComments) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      let postWithComments = [post, postComments];
      res.json(postWithComments);
    });
  });
};

exports.edit_post = [
  body("title", "Title must not be empty.").trim().isLength({ min: 1 }),
  body("text", "Post body must not be empty.").trim().isLength({ min: 1 }),

  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        const { body, validationResult, check } = require("express-validator");
        const { postid } = req.params;
        const { title, text } = req.body;

        //Checks if you're an admin
        User.findOne({ _id: authData._id }, (err, user) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          Post.findOne({ _id: postid }, (err, originalPost) => {
            if (err) {
              console.log(err);
              return res.json(err);
            }

            if (!user.isAdmin) {
              //If user isn't an admin, then check if they are the original author
              //Verify that edittor is the post author
              if (authData._id != originalPost.author_id) {
                console.log(
                  "Cannot unpublish this post because you are not the post's author or an admin"
                );
                return res
                  .status(400)
                  .json(
                    "Cannot unpublish this post because you are not the post's author or an admin"
                  );
              }
            }

            Post.findOneAndUpdate(
              { _id: postid },
              { title, text },
              { useFindAndModify: false, new: true },
              (err, updatedPost) => {
                if (err) {
                  console.log(err);
                  return res.json(err);
                }
                res.json({
                  message: "Post created",
                  post: updatedPost,
                });
              }
            );
          });
        });
      }
    });
  },
];

exports.publish_post = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { body, validationResult, check } = require("express-validator");
      const { postid } = req.params;
      isPublished = true;

      //Checks if you're an admin
      User.findOne({ _id: authData._id }, (err, user) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        Post.findOne({ _id: postid }, (err, originalPost) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          if (!user.isAdmin) {
            //If user isn't an admin, then check if they are the original author_id
            //Verify that edittor is the post author
            if (authData._id != originalPost.author_id) {
              console.log(
                "Cannot unpublish this post because you are not the post's author or an admin"
              );
              return res
                .status(400)
                .json(
                  "Cannot unpublish this post because you are not the post's author or an admin"
                );
            }
          }

          Post.findOneAndUpdate(
            { _id: postid },
            { isPublished },
            { useFindAndModify: false, new: true },
            (err, updatedPost) => {
              if (err) {
                console.log(err);
                return res.json(err);
              }
            }
          );
        });
      });
    }
  });
};

exports.unpublish_post = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { body, validationResult, check } = require("express-validator");
      const { postid } = req.params;
      isPublished = false;

      //Checks if you're an admin
      User.findOne({ _id: authData._id }, (err, user) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        Post.findOne({ _id: postid }, (err, originalPost) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          if (!user.isAdmin) {
            //If user isn't an admin, then check if they are the original author_id
            //Verify that edittor is the post author
            if (authData._id != originalPost.author_id) {
              console.log(
                "Cannot unpublish this post because you are not the post's author or an admin"
              );
              return res
                .status(400)
                .json(
                  "Cannot unpublish this post because you are not the post's author or an admin"
                );
            }
          }

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

exports.delete_post = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { body, validationResult, check } = require("express-validator");
      const { postid } = req.params;

      //Checks if you're an admin
      User.findOne({ _id: authData._id }, (err, user) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        Post.findOne({ _id: postid }, (err, originalPost) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          if (!user.isAdmin) {
            //If user isn't an admin, then check if they are the original author
            //Verify that edittor is the post author
            if (authData._id != originalPost.author_id) {
              console.log(
                "Cannot delete this post because you are not the post's author or an admin"
              );
              return res
                .status(400)
                .json(
                  "Cannot delete this post because you are not the post's author or an admin"
                );
            }
          }

          Post.findOneAndDelete({ _id: postid }, (err, deletedPost) => {
            if (err) return res.json(err);
            res.json(deletedPost);
            next();
          });
        });
      });
    }
  });
};

exports.get_comments = (req, res, next) => {
  const { body, validationResult, check } = require("express-validator");
  const { postid } = req.params;

  Comment.find({ parent: postid }, (err, postComments) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    res.json(postComments);
  });
};
