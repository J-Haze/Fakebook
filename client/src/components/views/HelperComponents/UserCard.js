import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import "../HomePage/HomePage.css";

const UserCard = (props) => {
  const history = useHistory();

  return (
    <div
      className="home-user-card"
      key={props.user._id}
      onClick={() => {
        history.push(`/user/${props.user._id}`);
      }}
    >
      <img
        className="prof-pic-home-user-page"
        alt={`profile-pic-user-${props.user.firstname}-${props.user.lastname}`}
        src={`http://localhost:5000/uploads/${props.user.photo.filename}`}
      />
      <div className="home-user-card-info">
        <div
          className="home-user-card-username"
          onClick={() => {
            history.push(`/user/${props.user._id}`);
          }}
        >
          {props.user.firstname} {props.user.lastname}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
