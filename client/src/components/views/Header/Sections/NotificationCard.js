import React from "react";

import "../Header.css";

function NotificationCard(props) {

  return (
    <div
      key={props.notification._id}
      className="link notification-card"
      onClick={(event) => {
        props.handleNotificationClick(props.notification);
      }}
    >
      <img
        className="prof-pic-notification-card"
        alt={`profile-pic-user-${props.notification.sender.firstname}-${props.notification.sender.lastname}`}
        src={`http://localhost:5000/uploads/${props.notification.sender.photo.filename}`}
      />
      {props.notification.action === "like" ? (
        <div className="notification-action">
          <strong className="strong-blk">
            {props.notification.sender.firstname}{" "}
            {props.notification.sender.lastname}
          </strong>{" "}
          liked your {props.notification.objectType}.
        </div>
      ) : props.notification.action === "comment" ? (
        <div className="notification-action">
          <strong className="strong-blk">
            {props.notification.sender.firstname}{" "}
            {props.notification.sender.lastname}
          </strong>{" "}
          commented on your post.
        </div>
      ) : props.notification.action === "sentRequest" ? (
        <div className="notification-action">
          <strong className="strong-blk">
            {props.notification.sender.firstname}{" "}
            {props.notification.sender.lastname}
          </strong>{" "}
          sent you a friend request.
        </div>
      ) : props.notification.action === "acceptedRequest" ? (
        <div className="notification-action">
          <strong className="strong-blk">
            {props.notification.sender.firstname}{" "}
            {props.notification.sender.lastname}
          </strong>{" "}
          accepted your friend request.
        </div>
      ) : (
        ""
      )}
      {props.notification.interacted || props.hideDots ? (
        ""
      ) : (
        <div className="blue-dot"></div>
      )}
    </div>
  );
}

export default NotificationCard;
