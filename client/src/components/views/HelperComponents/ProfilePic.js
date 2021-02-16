import React from "react";
import { Link } from "react-router-dom";

const ProfilePic = (props) => {

  if (props.user.photo) {
    return (
      <Link className="link" to={`/user/${props.user._id}`}>
        <img
          className="prof-pic"
          alt={`profile-pic-user-${props.user.firstname}-${props.user.lastname}`}
          src={`http://localhost:5000/uploads/${props.user.photo.filename}`}
        />
      </Link>
    );
  } else {
    return (
      <Link className="link" to={`/user/${props.user._id}`}>
        <img
          className="prof-icon"
          alt={`Default Profile Picture`}
          src={`http://localhost:5000/uploads/default-prof-pic.png`}
        />
      </Link>
    );
  }
};

export default ProfilePic;
