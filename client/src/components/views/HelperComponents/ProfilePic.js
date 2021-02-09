import React from "react";

const ProfilePic = (props) => {
  //               <img
  //     className="card-image"
  //     src={`http://localhost:5000/uploads/${props.post.image.filename}`}
  //   />

  console.log("props.user.photo", props.user.photo);

  if (props.user.photo) {
    return (
      <img
        className="prof-pic"
        alt={`profile-pic-user-${props.user.firstname}-${props.user.lastname}`}
        src={`http://localhost:5000/uploads/${props.user.photo.filename}`}
      />
    );
  } else {
    return <div className="prof-icon"></div>;
  }
};

export default ProfilePic;
