const passport = require("../config/passport");
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const jwt = require("jsonwebtoken");
var fs = require("fs");
var path = require("path");
const multer = require("multer");
require("dotenv").config();

var User = require("../models/User");
var Post = require("../models/Post");
var Comment = require("../models/Comment");

exports.get_posts = (req, res, next) => {
  Post.find((err, posts) => {
    if (err) return res.json(err);
    res.json(posts);
  }).populate("author");
};

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

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     //must be jpg or png to upload
//     if (ext !== ".jpg" || ext !== ".png") {
//       return cb(res.status(400).end("only jpg, png are allowed"), false);
//     }
//     cb(null, true);
//   },
// });

// var upload = multer({ storage: storage }).single("file");

exports.post_create_post = [
  // Validate and sanitize fields.
  // body("text", "Can't submit a blank post").not().isEmpty().trim(),
  // Add image thing later
  // body("timestamp").escape(),

  // upload.single("file"),
  upload.any("file"),
  (req, res) => {
    // console.log("blah", req);
    // console.log("try", req.body);
    // console.log("token", req.token);
    // console.log("file", req.body.file);
    // console.log("file2", req.body[0]);

    // console.log("files[0]", req.files[0]);
    // console.log({req.body})
    // if (req.files) {
    //   console.log("req.files", req.files[0]);
    // }

    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        // console.log("req", req)
        // upload(req, res, (err) => {
        // console.log("request:", req);
        console.log("request body:", req.body);
        // console.log("req.body.text", req.body.text);
        // console.log("req.body.image", req.body.image);
        console.log("authdata", authData);

        User.findOne({ _id: authData._id }, function (err, user) {
          if (err) {
            console.log("Could not find author");
            return res.json(err);
          }
          let postAuthor = user;
          console.log("postAuthor", postAuthor);
          // })

          let finalText = "";
          if (req.body.text) {
            finalText = req.body.text;
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

            var post = new Post({
              text: finalText,
              // image: {
              //   data: fs.readFileSync(
              //     // path.join(__dirname + "/uploads/" + req.file.filename)
              //     path.join(__dirname + "/uploads/" + format)
              //   ),
              //   contentType: "image/png",
              // },
              // image: {
              //   data: fs.readFileSync(
              //     // path.join(__dirname + "/uploads/" + req.file.filename)
              //     path.join(__dirname + "/uploads/" + req.body.image)
              //   ),
              //   contentType: "image/png",
              // },
              // image: final_img,
              image: {
                fieldname: req.files[0].fieldname,
                originalname: req.files[0].originalname,
                encoding: req.files[0].encoding,
                mimetype: req.files[0].mimetype,
                destination: req.files[0].destination,
                filename: req.files[0].filename,
                // path: 'uploads\\1611900591809-file',
                // path: fs.readFileSync(
                //   path.join(__dirname + "/uploads/" + req.file.filename)
                // ),
                path: fs.readFileSync(
                  // path.join("http://localhost:3000/uploads/" + req.file.filename)
                  // path.join(__dirname + "/uploads/" + req.file.filename)
                  path.join(
                    __dirname,
                    "../..",
                    "/uploads/" + req.files[0].filename
                  )
                  // path.join("/uploads/" + req.file.filename)
                ),
                encoded: final_img,
                contentType: `image/{format}`,
                // contentType: "image/png",
              },
              likesList: [],
              author: authData._id,
              // author: postAuthor,
              isPublished: true,
            });
          } else {
            console.log("no image");
            // console.log("author:", authData);
            var post = new Post({
              text: finalText,
              image: {
                fieldname: "",
                originalname: "",
                encoding: "",
                mimetype: "",
                destination: "",
                filename: "",
                path: "",
                encoded: "",
                contentType: "",
              },
              likesList: [],
              author: authData._id,
              // author: postAuthor,
              isPublished: true,
            });
          }

          // User.findOne({ _id: authData._id }, function (err, user) {
          //   if (err) {
          //     console.log("Could not find author");
          //     return res.json(err);
          //   }
          //   let postAuthor = user;
          //   console.log("postAuthor", postAuthor);
          // });

          post.save(function (err) {
            if (err) {
              console.log("Failed to save");
              console.log(err);
              return res.status(400).json({
                success: false,
                err,
              });
            }

            post.author = postAuthor;

            console.log("New Post:", post);
            console.log("Post author", postAuthor);
            return res.json({
              message: "Post created",
              success: true,
              post: post,
              // postAuthor: postAuthor
            });

            // post
            //   .populate("author")
            //   .execPopulate()
            //   .then(
            //     // console.log("New Post:", post)
            //     res.json({
            //       message: "Post created",
            //       success: true,
            //       post: post,
            //     })
            //   )

            // (post) => res.json(post))
            // .catch((err) => res.json(err));
          });

          // console.log("post1", post);

          // post
          //   .populate("author")
          //   .then(
          //     // console.log("New Post:", post)
          //     res.json({
          //       message: "Post created",
          //       success: true,
          //       post: post,
          //     })
          //   )
          //   .catch((err) => res.json(err));

          // console.log("authData._id", authData._id);

          // Post.find({ author: authData._id })
          //   .populate("author")
          //   // .execPopulate()
          //   // .exec()
          //   .exec(function (err, newPost) {
          //     if (err) return handleError(err);
          //     console.log("New Post", newPost);
          //     // console.log("newPost.author.firstname", newPost.author.firstname);
          //     // prints "The author is Bob Smith"
          //   })
          //   //   .then(
          //   //     // console.log("New Post:", post)
          //   //     res.json({
          //   //       message: "Post created",
          //   //       success: true,
          //   //       post: post,
          //   //     })
          //   // ).then(
          //   //     console.log("new post", post)
          //   //   )
          //   // .catch((err) => res.json(err));

          // Post.find({ author: authData._id })
          //   .populate("author")
          //   // .execPopulate()
          //   // .exec()
          //   // .exec(function (err, newPost) {
          //   //   if (err) return handleError(err);
          //   //   console.log("New Post", newPost);
          //   //   // console.log("newPost.author.firstname", newPost.author.firstname);
          //   //   // prints "The author is Bob Smith"
          //   // })
          //   .then(
          //     (newPost) => {
          //       res.json({
          //         message: "Post created",
          //         success: true,
          //         post: post,
          //         newPost: newPost,
          //       });
          //     }
          //     // console.log("New Post:", post)
          //   )
          //   .then(console.log("new post", newPost))
          //   .catch((err) => res.json(err));
        });
      }
    });
  },

  //   });
  // },
];

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
    }).populate("author")
  }).populate("author");
};

//Not used

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
                  "Cannot edit this post because you are not the post's author or an admin"
                );
                return res
                  .status(400)
                  .json(
                    "Cannotedit this post because you are not the post's author or an admin"
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

      console.log("postid", postid);

      //Checks if you're an admin
      User.findOne({ _id: authData._id }, (err, user) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        console.log("authData._id", authData._id);

        Post.findOne({ _id: postid }, (err, originalPost) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          console.log("originalPost", originalPost);

          if (!user.isAdmin) {
            //If user isn't an admin, then check if they are the original author_id
            //Verify that edittor is the post author
            if (authData._id != originalPost.author._id) {
              console.log(
                "Cannot delete this post because you are not the post's author"
              );
              return res.status(400).json({
                message:
                  "Cannot delete this post because you are not the post's author",
              });
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
  }).populate("author");
};
