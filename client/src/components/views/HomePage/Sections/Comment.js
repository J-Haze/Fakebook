import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Axios from "axios";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

import thumbBlue from "../../../../assets/thumbs-up-solid-light-blue.svg";

function Comments(props) {
  const [likeCount, setLikeCount] = useState(0);

  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);

  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  // const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(true);

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
        console.log("liked");
        setLikedByCurrentUser(true);
        props.sendNotification(
          props.comment.author._id,
          "like",
          "comment",
          props.comment._id
        );

        //  props.fetchPosts();
        //  history.push(`/user/${currentUser._id}`);
        //  history.go(0);
      })
      .catch((error) => {
        console.log("error", error);
        setLikedByCurrentUser(false);
        //  alert("Cannot like this post.");
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
        console.log("unliked");
        setLikedByCurrentUser(false);

        //  props.fetchPosts();
        //  history.push(`/user/${currentUser._id}`);
        //  history.go(0);
      })
      .catch((error) => {
        console.log("error", error);
        setLikedByCurrentUser(true);
        //  alert("Cannot like this post.");
      });
  }

  function toggleLike() {
    if (likedByCurrentUser === false) {
      //Use "like backend"
      likeComment();
    } else {
      console.log("unliked");
      // setLikedByCurrentUser(false);
      //Use "unlike" backend!
      unlikeComment();
    }
  }

  function checkIfLiked() {
    console.log("here1");
    if (
      props.comment.likesList.length === 0 ||
      props.comment.likesList.length === undefined
    ) {
      console.log("here2");
      setLikedByCurrentUser(false);
      return;
    }
    if (props.comment.likesList.indexOf(props.currentUser._id) != -1) {
      console.log("here3");
      setLikedByCurrentUser(true);
    } else {
      setLikedByCurrentUser(false);
    }
  }

  useEffect(() => {
    checkIfLiked();
  }, []);

  function deleteComment(commentid) {
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
        //  if (res.data.message) {
        //    alert(res.data.message);
        //    return
        //  }
        setDeleteCommentModalOpen(false);
        props.fetchComments();
        // props.fetchPosts();
        //  history.push(`/user/${currentUser._id}`);
        // history.go(0);
      })
      .catch((error) => {
        console.log("error", error);
        alert("Cannot delete this post.");
      });

    // console.log(commentid);
  }

  function calculateLikes() {
    props.fetchComments();
    if (
      props.comment.likesList.length === 0 ||
      props.comment.likesList.length === undefined
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
        {/* <div className="prof-icon-small"></div> */}
        {props.comment.author.photo ? (
          <Link className="link" to={`/user/${props.comment.author._id}`}>
            <img
              className="prof-icon-small"
              alt={`profile-pic-user-${props.comment.author.firstname}-${props.comment.author.lastname}`}
              src={`http://localhost:5000/uploads/${props.comment.author.photo.filename}`}
            />
          </Link>
        ) : (
          <Link className="link" to={`/user/${props.comment.author._id}`}>
            <img
              className="prof-icon-small"
              alt={`Default Profile Picture`}
              src={`http://localhost:5000/uploads/default-prof-pic.png`}
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
            {likeCount === 0 ? (
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
                        deleteComment(props.comment._id);
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
          {/* {deleteCommentModalOpen ? (
            <div
              className="del-comment-modal"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <div className="del-comment-modal-text">Delete this comment?</div>
              <div className="del-post-modal-btn-cont">
                <div
                  className="del-post-modal-confirm del-post-modal-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteComment(props.comment._id);
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
          )} */}
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

      {/* <div className="comment-author flex">
                  <Link
                    className="comment-link space-small"
                    to={`/user/${comment.author}`}
                  >
                    - Commented by <strong>{comment.username}</strong>
                  </Link>{" "}
                  on {moment(comment.createdAt).format("LLL")}
                  <div className="space-small">- </div>
                </div> */}
    </div>
  );
}

export default Comments;
