import React from "react";
import { useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Axios from "axios";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

import Comment from "./Comment";

const filter = new badWords();

function Comments(props) {
  const [newComment, setNewComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  const submitComment = () => {
    if (filter.isProfane(newComment)) {
      alert("Comment contains a word that is not allowed.");
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
        console.log("whats going on", props.post._id)
        props.sendNotification(props.post.author._id, "comment", "comment", props.post._id)
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="comment-section">
      {props.comments.length > 0 ? (
        <div className="comment-card-box">
          {props.comments.map((comment) =>
            !comment.isPublished ? (
              ""
            ) : (
              <Comment
                key={comment._id}
                comment={comment}
                currentUser={props.currentUser}
                fetchComments={props.fetchComments}
                postid={props.postid}
                sendNotification={props.sendNotification}
              />
            )
          )}
        </div>
      ) : (
        ""
      )}
      <div className="leave-comment-section">
        <div className="leave-comment-cont">
          {props.currentUser.photo ? (
            <Link className="link" to={`/user/${props.currentUser._id}`}>
              <img
                className="prof-icon-small"
                alt={`profile-pic-user-${props.currentUser.firstname}-${props.currentUser.lastname}`}
                src={`https://justins-fakebook-api.herokuapp.com/uploads/${props.currentUser.photo.filename}`}
              />
            </Link>
          ) : (
            <Link className="link" to={`/user/${props.currentUser._id}`}>
              <img
                className="prof-icon-small"
                alt={`Default Profile Picture`}
                src={`https://justins-fakebook-api.herokuapp.com/uploads/default-prof-pic.png`}
              />
            </Link>
          )}
          <div className="leave-comment-cont-inner">
            <div className="leave-comment-bubble">
              <input
                className="comment-input"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div
                className="submit-comment-btn"
                onClick={() => {
                  submitComment();
                }}
              >
                Submit
              </div>
            </div>
          </div>
        </div>
        {errorMessage ? (
          <div className="error-message-comment">{errorMessage}</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Comments;
