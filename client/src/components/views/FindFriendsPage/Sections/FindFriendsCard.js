import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useHistory } from "react-router-dom";

function Card(props) {
  const history = useHistory();

  return (
    <div className="friend-card" key={props.user._id}>
      <Link className="link" to={`/user/${props.user._id}`}>
        <img
          className="prof-pic-friendList-page"
          alt={`profile-pic-user-${props.user.firstname}-${props.user.lastname}`}
          src={`http://localhost:5000/uploads/${props.user.photo.filename}`}
        />
      </Link>
      <div className="friend-card-info">
        <div
          className="friend-card-username"
          onClick={() => {
            history.push(`/user/${props.user._id}`);
          }}
        >
          {props.user.firstname} {props.user.lastname}
        </div>
        <div className="friend-card-location">{props.user.location}</div>
          </div>
          
          <div className="find-friends-btn-cont">
          {(props.type == "receivedReq") ? (<div></div>):


}
              </div>
          
    </div>
  )
}

export default Card;
