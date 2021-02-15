import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import "../Header.css";

function NotificationCard(props) {
//   const [hideDot, setHideDot] = useState(false);

  // useEffect(() => {
  //   setHideDot(props.notification.interacted);
  // }, [props.notification.interacted]);

//   useEffect(() => {
//       setHideDot(false);
      
//       return( setHideDot(true) )
//   }, []);

  return (
    <div
      key={props.notification._id}
      className="link notification-card"
      // to={`/${notification.objectType}/${notification.objectId}`}
      // to={`/user/${props.currentUser._id}`}
      onClick={(event) => {
        // props.setNotificationModalOpen(false);
        props.handleNotificationClick(props.notification);
        // setHideDot(true);
      }}
    >
      <img
        className="prof-pic-notification-card"
        alt={`profile-pic-user-${props.notification.sender.firstname}-${props.notification.sender.lastname}`}
        src={`http://localhost:5000/uploads/${props.notification.sender.photo.filename}`}
      />
      {/* <div classname="notification-text"> */}
      {/* <div className="notification-card-name">
                          {notification.sender.firstname}{" "}
                          {notification.sender.lastname}
                        </div> */}
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
      {/* {props.hideDots || hideDot ?  */}
      {props.notification.interacted || props.hideDots ? (
        ""
      ) : (
        <div className="blue-dot"></div>
      )}
    </div>
  );
}

export default NotificationCard;
