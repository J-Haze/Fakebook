import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import thumbBlack from "../../../../assets/thumbs-up-regular-gray.svg";
import thumbBlue from "../../../../assets/thumbs-up-solid-light-blue.svg";

import ProfilePic from "../../HelperComponents/ProfilePic.js";
import Comments from "./Comments";

function Card(props) {
  const [displayedComments, setDisplayedComments] = useState([]);

  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (props.fromUserPage) {
      setCommentsOpen(true);
    }
  }, [props.fromUserPage]);

  function likePost() {
    setLikedByCurrentUser(true);
    let newLikes = likeCount + 1;
    setLikeCount(newLikes);
    Axios.put(
      `/post/${props.post._id}/like`,
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
          props.post.author._id,
          "like",
          "post",
          props.post._id
        );
      })
      .catch((error) => {
        console.log("error", error);
        setLikedByCurrentUser(false);
      });
  }

  function unlikePost() {
    setLikedByCurrentUser(false);
    let newLikes = likeCount - 1;
    setLikeCount(newLikes);
    Axios.put(
      `/post/${props.post._id}/unlike`,
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

  function checkIfLiked() {
    if (
      props.post.likesList.length == 0 ||
      props.post.likesList.length == undefined
    ) {
      setLikedByCurrentUser(false);
      return;
    }

    setLikedByCurrentUser(false);

    for (let i = 0; i < props.post.likesList.length; i++) {
      if (props.post.likesList[i]._id == props.currentUser._id) {
        setLikedByCurrentUser(true);
      }
    }
  }

  useEffect(() => {
    checkIfLiked();
  }, []);

  function toggleLike() {
    if (likedByCurrentUser == false) {
      likePost();
    } else {
      unlikePost();
    }
  }

  function deletePost(postid) {
    Axios.put(
      `/post/${props.post._id}/unpublish`,
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
        setDeletePostModalOpen(false);
        props.fetchPosts();
        history.go(0);
      })
      .catch((error) => {
        console.log("error", error);
        alert("Cannot delete this post.");
      });
  }

  const fetchComments = () => {
    Axios.get(`/post/${props.post._id}/comments`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    }).then((res) => {
      let publishedComments = [];
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].isPublished) {
          if (publishedComments.length == 0 || publishedComments == undefined) {
            publishedComments = [res.data[i]];
          } else {
            publishedComments.push(res.data[i]);
          }
        }
      }
      setDisplayedComments(publishedComments);
    });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    setCommentCount(displayedComments.length);
  }, [displayedComments]);

  function calculateLikes() {
    props.fetchPosts();
    if (
      props.post.likesList.length == 0 ||
      props.post.likesList.length == undefined
    ) {
      setLikeCount(0);
      return;
    } else {
      setLikeCount(props.post.likesList.length);
    }
  }

  useEffect(() => {
    calculateLikes();
  }, []);

  //Close comments on unmount
  useEffect(() => {
    return function cleanup() {
      setCommentsOpen(false);
    };
  }, []);

  function toggleCommentsOpen() {
    if (commentsOpen == true) {
      setCommentsOpen(false);
    } else {
      setCommentsOpen(true);
    }
  }

  return (
    <div
      className="card"
      onClick={() => {
        setDeletePostModalOpen(false);
      }}
    >
      <div className="main-card">
        <div className="card-row-one">
          <ProfilePic user={props.post.author} />
          <div className="flex-down card-title">
            <Link
              className="link card-username hover-under"
              to={`/user/${props.post.author._id}`}
            >
              {props.post.author.firstname} {props.post.author.lastname}
            </Link>

            <div className="card-date">
              {moment(props.post.createdAt).format("ll")} at{" "}
              {moment(props.post.createdAt).format("LT")}
            </div>
          </div>
          {props.post.author._id == props.currentUser._id ? (
            <span
              className="del-post-x"
              onClick={(event) => {
                event.stopPropagation();
                setDeletePostModalOpen(true);
              }}
            >
              &times;
            </span>
          ) : (
            ""
          )}
          {deletePostModalOpen ? (
            <div
              className="del-post-modal"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <div className="del-post-modal-text">Delete this post?</div>
              <div className="del-post-modal-btn-cont">
                <div
                  className="del-post-modal-confirm del-post-modal-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    deletePost();
                  }}
                >
                  Delete
                </div>
                <div
                  className="del-post-modal-cancel del-post-modal-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    setDeletePostModalOpen(false);
                  }}
                >
                  Cancel
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="card-row-two">{props.post.text}</div>
        {props.post.image ? (
          <div>
            <div>
              {props.post.image.url && (
                <div>
                  <img
                    className="card-image"
                    src={`${props.post.image.url}`}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="card-row-three">
          {likeCount == 1 ? (
            <div className="like-count">{likeCount} Like</div>
          ) : (
            <div className="like-count">{likeCount} Likes</div>
          )}
          <div
            className="comment-count"
            onClick={() => {
              toggleCommentsOpen();
            }}
          >
            {commentCount} Comments
          </div>
        </div>
        <div className="card-row-four">
          <div
            className="like-box"
            onClick={() => {
              toggleLike();
            }}
          >
            {likedByCurrentUser ? (
              <div className="flex">
                <img src={thumbBlue} className="thumb"></img>
                <div className="blue">Like</div>
              </div>
            ) : (
              <div className="flex">
                <img src={thumbBlack} className="thumb"></img>
                <div className="black">Like</div>
              </div>
            )}
          </div>
          <div
            className="comment-box"
            onClick={() => {
              setCommentsOpen(true);
            }}
          >
            Comment
          </div>
        </div>
      </div>
      <div className="card-row-five">
        {commentsOpen ? (
          <Comments
            comments={displayedComments}
            currentUser={props.currentUser}
            fetchComments={fetchComments}
            postid={props.post._id}
            sendNotification={props.sendNotification}
            post={props.post}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Card;
