import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

// import thumbBlack from "../../../../assets/thumbs-up-solid.svg";
import thumbBlack from "../../../../assets/thumbs-up-regular-gray.svg";
import thumbBlue from "../../../../assets/thumbs-up-solid-light-blue.svg";

// https://fontawesome.com/icons/thumbs-up?style=light

function Card(props) {
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 21));
  const [commentCount, setCommentCount] = useState(
    Math.floor(Math.random() * 21)
  );
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);

  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);

  //Code that calculates like Count

  //Code that calculates commentCount

  //Code that searches for current user in the liked list and then sets likedByCurrentUser

  function toggleLike() {
    if (likedByCurrentUser == false) {
      console.log("liked");
      setLikedByCurrentUser(true);
      //Use "like backend"
    } else {
      console.log("unliked");
      setLikedByCurrentUser(false);
      //Use "unlike" backend!
    }
  }

  function showComments() {
    //Need to add
    console.log("show comments");
  }

  console.log("image", props.post.image);
  // console.log("image.data", props.post.image.data);

  // function getAuthor() {

  // }

  // console.log("Post", props.post)

  return (
    <div
      className="card"
      onClick={() => {
        setDeletePostModalOpen(false);
      }}
    >
      <div className="main-card">
        <div className="card-row-one">
          <div className="prof-icon"></div>
          {/* <UserAvatar user={post.author} /> */}
          <div className="flex-down card-title">
            <div className="card-username">
              {props.post.author.firstname} {props.post.author.lastname}
            </div>
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
                <div className="del-post-modal-confirm del-post-modal-btn">
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
              {props.post.image.filename && (
                <div>
                  <img
                    className="card-image"
                    src={`http://localhost:5000/uploads/${props.post.image.filename}`}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="card-row-three">
          <div className="like-count">{likeCount} Likes</div>
          <div
            className="comment-count"
            onClick={() => {
              showComments();
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
            {/* <i class="fas fa-thumbs-up thumb">&#xf164;</i> */}
            {/* <i src={thumb}></i> */}
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
              showComments();
            }}
          >
            Comment
          </div>
        </div>
      </div>
      <div className="card-row-five"> Comments here</div>
    </div>
  );
}

export default Card;
