import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

function Card(props) {
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 21));
  const [commentCount, setCommentCount] = useState(Math.floor(Math.random() * 21));

  return (
    <div className="card">
      <div className="main-card">
        <div className="card-row-one">
          <div className="prof-icon"></div>
          <div className="flex-down">
            <div>
              {props.currentUser.firstname} {props.currentUser.lastname}
            </div>
            <div>{props.post.createdAt}</div>
          </div>
        </div>
        <div className="card-row-two">{props.post.text}</div>
        <div className="card-row-three">
          <div>{likeCount} Likes</div>
          <div>{commentCount} Comments</div>
        </div>
        <div className="card-row-four">
          <div>Like</div>
          <div>Comment</div>
        </div>
      </div>
      <div className="card-row-five"></div>
    </div>
  );
}

export default Card;
