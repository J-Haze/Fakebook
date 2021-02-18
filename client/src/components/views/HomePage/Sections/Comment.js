import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Axios from "axios";

import { useHistory } from "react-router-dom";

import thumbBlue from "../../../../assets/thumbs-up-solid-light-blue.svg";

function Comments(props) {
  const [likeCount, setLikeCount] = useState(0);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);

  const history = useHistory();

  function likeComment() {
    setLikedByCurrentUser(true);
    let newLikes = likeCount + 1;
    setLikeCount(newLikes);
    Axios.put(
      `/post/${props.postid}/${props.comment._id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
      }
    )
      .then((res) => {
        setLikedByCurrentUser(true);
        props.sendNotification(
          props.comment.author._id,
          "like",
          "comment",
          props.comment._id
        );
      })
      .catch((error) => {
        console.log("error", error);
        setLikedByCurrentUser(false);
      });
  }

  function unlikeComment() {
    setLikedByCurrentUser(false);
    let newLikes = likeCount - 1;
      setLikeCount(newLikes);

    Axios.put(
      `/post/${props.postid}/${props.comment._id}/unlike`,
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
      }
    )
      .then((res) => {
        setLikedByCurrentUser(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLikedByCurrentUser(true);
      });
  }

  function toggleLike() {
    if (likedByCurrentUser == false) {
      likeComment();
    } else {
      unlikeComment();
    }
  }

  function checkIfLiked() {
    if (
      props.comment.likesList.length == 0 ||
      props.comment.likesList.length == undefined
    ) {
      setLikedByCurrentUser(false);
      return;
    }
     setLikedByCurrentUser(false);

     for (let i = 0; i < props.comment.likesList.length; i++) {
       if (props.comment.likesList[i]._id == props.currentUser._id) {
         setLikedByCurrentUser(true);
       }
    }
  }

  useEffect(() => {
    checkIfLiked();
  }, []);

  function deleteComment() {
    Axios.put(
      `/post/${props.postid}/${props.comment._id}/unpublish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
      }
    )
      .then((res) => {
        setDeleteCommentModalOpen(false);
        props.fetchComments();
      })
      .catch((error) => {
        console.log("error", error);
        alert("Cannot delete this post.");
      });
  }

  function calculateLikes() {
    props.fetchComments();
    if (
      props.comment.likesList.length == 0 ||
      props.comment.likesList.length == undefined
    ) {
      setLikeCount(0);
      return;
    } else {
      setLikeCount(props.comment.likesList.length);
    }
  }

  useEffect(() => {
    calculateLikes();
  }, []);

  return (
    <div key={props.comment._id} className="comment">
      <div className="comment-row-one">
        {props.comment.author.photo ? (
          <Link className="link" to={`/user/${props.comment.author._id}`}>
            <img
              className="prof-icon-small"
              alt={`profile-pic-user-${props.comment.author.firstname}-${props.comment.author.lastname}`}
              src={`${props.comment.author.photo.url}`}
            />
          </Link>
        ) : (
          <Link className="link" to={`/user/${props.comment.author._id}`}>
            <img
              className="prof-icon-small"
              alt={`Default Profile Picture`}
              src={`https://justins-fakebook-api.herokuapp.com/uploads/default-prof-pic.png`}
            />
          </Link>
        )}
        <div className="comment-cont-inner">
          <div className="comment-bubble">
            <div
              className="comment-username hover-under"
              onClick={(event) => {
                history.push(`/user/${props.comment.author._id}`);
              }}
            >
              {props.comment.author.firstname} {props.comment.author.lastname}
            </div>
            <div className="comment-text">{props.comment.text}</div>
            {likeCount == 0 ? (
              ""
            ) : (
              <div className="comment-like-count">
                <img src={thumbBlue} className="thumb-comment"></img>
                <div className="comment-like-count-text">
                  {"   "}
                  {likeCount}
                </div>
              </div>
            )}
          </div>

          {props.comment.author._id === props.currentUser._id ? (
            <span
              className="del-comment-x"
              onClick={(event) => {
                event.stopPropagation();
                setDeleteCommentModalOpen(true);
              }}
            >
              &times;
              {deleteCommentModalOpen ? (
                <div
                  className="del-comment-modal"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <div className="del-comment-modal-text">
                    Delete this comment?
                  </div>
                  <div className="del-post-modal-btn-cont">
                    <div
                      className="del-post-modal-confirm del-post-modal-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteComment();
                      }}
                    >
                      Delete
                    </div>
                    <div
                      className="del-post-modal-cancel del-post-modal-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeleteCommentModalOpen(false);
                      }}
                    >
                      Cancel
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="comment-row-two">
        {likedByCurrentUser ? (
          <div
            className="comment-like-blue hover-under"
            onClick={() => {
              toggleLike();
            }}
          >
            Like
          </div>
        ) : (
          <div
            className="comment-like hover-under"
            onClick={() => {
              toggleLike();
            }}
          >
            Like
          </div>
        )}
        <div className="comment-time">
          · {moment(props.comment.createdAt).fromNow()}
        </div>
      </div>
    </div>
  );
}

export default Comments;
