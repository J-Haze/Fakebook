const passport = require("../config/passport");
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var User = require("../models/User");
var Post = require("../models/Post");

exports.get_posts = (req, res, next) => {
  Post.find((err, posts) => {
    if (err) return res.json(err);
    res.json(posts);
  });
};

exports.post_create_post = [
  // Validate and sanitize fields.
  body("title", "Title must not be empty.").trim().isLength({ min: 1 }),
  body("text", "Post body must not be empty.").trim().isLength({ min: 1 }),
  body("timestamp").escape(),

  (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        // Create a Post object with escaped and trimmed data.
        var post = new Post({
          title: req.body.title,
          text: req.body.text,
          author_id: authData._id,
          author: authData.username,
          isPublished: true,
        });

        // Data from form is valid. Save book.
        post.save(function (err) {
          if (err) {
            console.log(err);
            return err;
          }
          // Successful - redirect to home.
          // res.redirect("/");
          res.json({
            message: "Post created",
            post: post,
          });
        });
      }
    });
  },
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
