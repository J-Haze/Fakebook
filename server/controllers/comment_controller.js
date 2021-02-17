const { body, validationResult, check } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var User = require("../models/User");
var Comment = require("../models/Comment");

exports.post_create_comment = [
  // Validate and sanitize fields.
  body("text", "Text must not empty.").trim().isLength({ min: 1 }),
  body("timestamp").escape(),
  (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        const { postid } = req.params;
        var comment = new Comment({
          text: req.body.text,
          parent: postid,
          author: authData._id,
          likesList: [],
          isPublished: true,
        });

        // Data from form is valid. Save comment.
        comment.save(function (err) {
          if (err) {
            console.log("err", err);
            return res.json(err);
          }
          res.json(comment);
        });
      }
    });
  },
];

exports.delete_comment = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { body, validationResult, check } = require("express-validator");
      const { postid, commentid } = req.params;

      //Checks if you're an admin
      User.findOne({ _id: authData._id }, (err, user) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        Comment.findOne({ _id: commentid }, (err, originalComment) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          if (!user.isAdmin) {
            //If user isn't an admin, then check if they are the original author
            //Verify that edittor is the post author
            if (authData._id != originalComment.author) {
              console.log(
                "Cannot delete this comment because you are not the post's author or an admin"
              );
              return res
                .status(400)
                .json(
                  "Cannot delete this comment because you are not the post's author or an admin"
                );
            }
          }

          Comment.findOneAndDelete(
            { _id: commentid },
            (err, deletedComment) => {
              if (err) return res.json(err);
              res.json(deletedComment);
              next();
            }
          );
        });
      });
    }
  });
};

exports.unpublish_comment = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { postid, commentid } = req.params;
      isPublished = false;

      //Checks if you're an admin
      User.findOne({ _id: authData._id }, (err, user) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        Comment.findOne({ _id: commentid }, (err, originalComment) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          if (!user.isAdmin) {
            //If user isn't an admin, then check if they are the original author_id
            //Verify that edittor is the post author
            if (authData._id != originalComment.author) {
              console.log(
                "Cannot unpublish this comment because you are not the comment's author or an admin"
              );
              return res
                .status(400)
                .json(
                  "Cannot unpublish this comment because you are not the comment's author or an admin"
                );
            }
          }

          Comment.findOneAndUpdate(
            { _id: commentid },
            { isPublished },
            { useFindAndModify: false, new: true },
            (err, updatedComment) => {
              if (err) {
                console.log(err);
                return res.json(err);
              } else {
                res.json(updatedComment);
              }
            }
          );
        });
      });
    }
  });
};

exports.like_comment = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { body, validationResult, check } = require("express-validator");
      const { postid, commentid } = req.params;

      //Checks if you're an admin
      User.findOne({ _id: authData._id }, (err, user) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        Comment.findOne({ _id: commentid }, (err, originalComment) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          let orignialLikes = originalComment.likesList;

          //Taken care of in Front End
          if (orignialLikes) {
            if (orignialLikes.indexOf(authData._id) != -1) {
              return res.json("You've already liked this comment");
            }
          }

          let newLikes = orignialLikes;

          if (orignialLikes.length == 0 || orignialLikes == undefined) {
            newLikes = [authData._id];
          } else {
            newLikes.push(authData._id);
          }

          Comment.findOneAndUpdate(
            { _id: commentid },
            { likesList: newLikes },
            { useFindAndModify: false, new: true },
            (err, updatedComment) => {
              if (err) {
                console.log(err);
                return res.json(err);
              }
              res.json({
                message: "Comment created",
                comment: updatedComment,
              });
            }
          );
        });
      });
    }
  });
};

exports.unlike_comment = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const { body, validationResult, check } = require("express-validator");
      const { postid, commentid } = req.params;

      User.findOne({ _id: authData._id }, (err, user) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        Comment.findOne({ _id: commentid }, (err, originalComment) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          let orignialLikes = originalComment.likesList;

          if (orignialLikes.length == 0 || orignialLikes == undefined) {
            return res.json("You haven't liked this comment");
          }

          let newLikes = orignialLikes;

          // if current user ID is in likesList array then return
          //Taken care of in Front End
          if (newLikes.indexOf(authData._id) != -1) {
            newLikes.splice(newLikes.indexOf(authData._id));
          } else {
            return res.json("You haven't liked this comment");
          }

          Comment.findOneAndUpdate(
            {
              _id: commentid,
            },
            {
              likesList: newLikes,
            },
            {
              useFindAndModify: false,
              new: true,
            },
            (err, updatedComment) => {
              if (err) {
                console.log(err);
                return res.json(err);
              }
              res.json({
                message: "Comment created",
                comment: updatedComment,
              });
            }
          );
        });
      });
    }
  });
};
