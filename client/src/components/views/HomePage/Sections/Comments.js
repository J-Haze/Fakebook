import React from "react";
import { useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Axios from "axios";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

const filter = new badWords();

function Comments(props) {
  const [newComment, setNewComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  const submitComment = () => {
    if (filter.isProfane(newComment)) {
      alert("Comment contains a word that is not allowed.");
      setNewComment("");
      return;
    }

    if (newComment.length < 1) {
      setErrorMessage("Comment field must not be blank");
      return;
    }

    if (newComment.length > 140) {
      setErrorMessage("Comments are limited to 140 characters.");
      return;
    }

    Axios.post(
      `/post/${props.postid}/comment`,
      {
        text: newComment,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
      }
    )
      .then((res, err) => {
        setErrorMessage("");
        setNewComment("");
        props.fetchComments();
        history.push(`/post/${props.postid}`);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="comment-section">
      <div className="comment-header">Comments:</div>
      {props.comments.length > 0 ? (
        <div className="comment-box">
          {props.comments.map((comment) =>
            !comment.isPublished ? (
              ""
            ) : comment.author === props.currentUser._id ? (
              <div key={comment._id} className="comment">
                <div className="comment-text">{comment.text}</div>
                <div className="comment-author flex">
                  <Link
                    className="comment-link space-small"
                    to={`/user/${comment.author}`}
                  >
                    - Commented by <strong>{comment.username}</strong>
                  </Link>{" "}
                  on {moment(comment.createdAt).format("LLL")}
                  <div className="space-small">- </div>
                  <div
                    className="comment-delete"
                    onClick={() => {
                      props.openDeleteCommentModal(comment._id);
                    }}
                  >
                    Delete
                  </div>
                </div>
              </div>
            ) : (
              <div key={comment._id} className="comment">
                <div className="comment-text">{comment.text}</div>
                <div className="comment-author">
                  <Link className="comment-link" to={`/user/${comment.author}`}>
                    - Commented by <strong>{comment.username}</strong>
                  </Link>{" "}
                  on {moment(comment.createdAt).format("LLL")}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="no-comments"> No comments on this post.</div>
      )}
      <div className="leave-comment-section">
        {props.isLoggedIn ? (
          <div className="flex-down">
            <div id="leave-comment-cont">
              <input
                id="comment-input"
                // className="input"
                placeholder="Leave a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div
                id="submit-comment-btn"
                onClick={() => {
                  submitComment();
                }}
              >
                Submit
              </div>
            </div>
            <div className="error-message-comment">{errorMessage}</div>
          </div>
        ) : (
          <div className="no-user-cont">
            <div className="no-user-text">
              Please log in to add a comment to this post
            </div>
            <Link
              to={`/log-in`}
              style={{ textDecoration: "none" }}
              className="no-user-btn"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
      <Link to={`/`} style={{ textDecoration: "none" }} className="back-btn">
        Home
      </Link>{" "}
    </div>
  );
}

export default Comments;
