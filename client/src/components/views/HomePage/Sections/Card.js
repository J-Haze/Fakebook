import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import thumb from "../../../../assets/thumbs-up-solid.svg";

function Card(props) {
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 21));
  const [commentCount, setCommentCount] = useState(Math.floor(Math.random() * 21));
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);

  //Code that calculates like Count

  //Code that calculates commentCount

  //Code that searches for current user in the liked list and then sets likedByCurrentUser

  return (
    <div className="card">
      <div className="main-card">
        <div className="card-row-one">
          <div className="prof-icon"></div>
          <div className="flex-down card-title">
            <div className="card-username">
              {props.currentUser.firstname} {props.currentUser.lastname}
            </div>
            <div className="card-date">
              {moment(props.post.createdAt).format("ll")} at{" "}
              {moment(props.post.createdAt).format("LT")}
            </div>
          </div>
        </div>
        <div className="card-row-two">{props.post.text}</div>
        <div className="card-row-three">
          <div className="like-count">{likeCount} Likes</div>
          <div className="comment-count">{commentCount} Comments</div>
        </div>
        <div className="card-row-four">
          <div className="like-box">
            {/* <i class="fas fa-thumbs-up thumb">&#xf164;</i> */}
            {/* <i src={thumb}></i> */}
            <img src={thumb} className="thumb"></img>
            Like
          </div>
          <div className="comment-box">Comment</div>
        </div>
      </div>
      <div className="card-row-five"></div>
    </div>
  );
}

export default Card;
