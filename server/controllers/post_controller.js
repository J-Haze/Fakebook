const { body, validationResult, check } = require("express-validator");
const jwt = require("jsonwebtoken");
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

exports.get_posts = (req, res, next) => {
  Post.find({ isPublished: true }, (err, posts) => {
    if (err) return res.json(err);
    res.json(posts);
  })
    .populate("author")
    .populate({ path: "likesList", match: { isPublished: true } });
};

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

exports.post_create_post = [
  upload.any("file"),
  (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        User.findOne({ _id: authData._id }, function (err, user) {
          if (err) {
            console.log("Could not find author");
            return res.json(err);
          }
          let postAuthor = user;

          let finalText = "";
          if (req.body.text) {
            finalText = req.body.text;
          }

          if (req.files.length > 0) {
            req.files[0].filename = `${Date.now()}_${
              req.files[0].originalname
            }`;

            const splitName = req.files[0].originalname.split(".");
            const format = splitName[splitName.length - 1];

            const s3Params = {
              Bucket: process.env.S3_BUCKET,
              Key: req.files[0].filename,
              Body: req.files[0].buffer,
              ACL: "public-read",
            };

            S3.upload(s3Params, (err, data) => {
              if (err) {
                console.log(err);
                return res.json(err);
              } else {
                var post = new Post({
                  text: finalText,
                  image: {
                    fieldname: req.files[0].fieldname,
                    originalname: req.files[0].originalname,
                    encoding: req.files[0].encoding,
                    mimetype: req.files[0].mimetype,
                    destination: data.Location,
                    url: `https://${process.env.S3_BUCKET}.s3-us-west-2.amazonaws.com/${req.files[0].filename}`,
                    filename: req.files[0].filename,
                    size: req.files[0].size,
                    contentType: `image/${format}`,
                  },
                  likesList: [],
                  author: authData._id,
                  isPublished: true,
                });
              }

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

                return res.json({
                  message: "Post created",
                  success: true,
                  post: post,
                });
              });
            });
          } else {
            var post = new Post({
              text: finalText,
              image: {
                fieldname: "",
                originalname: "",
                encoding: "",
                mimetype: "",
                destination: "",
                url: "",
                filename: "",
                size: "",
                contentType: "",
              },
              likesList: [],
              author: authData._id,
              isPublished: true,
            });

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

              return res.json({
                message: "Post created",
                success: true,
                post: post,
              });
            });
          }
        });
      }
    });
  },
];

exports.get_post = (req, res, next) => {
  const { postid } = req.params;

  Post.findOne({ _id: postid, isPublished: true }, (err, post) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    Comment.find({ parent: postid, isPublished: true }, (err, postComments) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      let postWithComments = [post, postComments];
      res.json(postWithComments);
    })
      .populate("author")
      .populate({ path: "likesList", match: { isPublished: true } });
  })
    .populate("author")
    .populate({ path: "likesList", match: { isPublished: true } });
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

exports.like_post = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
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

          let orignialLikes = originalPost.likesList;

          // if current user ID is in likesList array then return
          //Taken care of in Front End
          if (orignialLikes) {
            if (orignialLikes.indexOf(authData._id) != -1) {
              return res.json("You've already liked this post");
            }
          }

          let newLikes = orignialLikes;

          if (orignialLikes.length == 0 || orignialLikes == undefined) {
            newLikes = [authData._id];
          } else {
            newLikes.push(authData._id);
          }

          Post.findOneAndUpdate(
            {
              _id: postid,
            },
            {
              likesList: newLikes,
            },
            {
              useFindAndModify: false,
              new: true,
            },
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
};

exports.unlike_post = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { postid } = req.params;

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

          let orignialLikes = originalPost.likesList;

          if (orignialLikes.length == 0 || orignialLikes == undefined) {
            return res.json("You haven't liked this post");
          }

          let newLikes = orignialLikes;

          // if current user ID is in likesList array then return
          //Taken care of in Front End
          if (newLikes.indexOf(authData._id) != -1) {
            newLikes.splice(newLikes.indexOf(authData._id));
          } else {
            return res.json("You haven't liked this post");
          }

          Post.findOneAndUpdate(
            {
              _id: postid,
            },
            {
              likesList: newLikes,
            },
            {
              useFindAndModify: false,
              new: true,
            },
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
};

//Not currently used
exports.publish_post = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
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
                "Cannot publish this post because you are not the post's author or an admin"
              );
              return res
                .status(400)
                .json(
                  "Cannot publish this post because you are not the post's author or an admin"
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
  const { postid } = req.params;

  Comment.find({ parent: postid }, (err, postComments) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    res.json(postComments);
  })
    .populate("author")
    .populate({ path: "likesList", match: { isPublished: true } });
};
