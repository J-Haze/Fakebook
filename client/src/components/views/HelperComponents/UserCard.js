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
      {props.user.photo ? (
        <img
          className="prof-pic-home-user-page"
          alt={`profile-pic-user-${props.user.firstname}-${props.user.lastname}`}
          src={`https://justins-fakebook-api.herokuapp.com/uploads/${props.user.photo.filename}`}
        />
      ) : (
        <img
          className="prof-icon"
          alt={`Default Profile Picture`}
          src={`https://justins-fakebook-api.herokuapp.com/uploads/default-prof-pic.png`}
        />
      )}

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
