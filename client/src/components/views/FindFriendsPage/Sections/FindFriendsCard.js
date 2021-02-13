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
        {props.type == "receivedReq" ? (
          <div className="friend-request-card-btn-cont">
            <div
              className="friend-request-card-btn-confirm"
              onClick={() => {
                // setUnfriendModalOpen(true);
                props.acceptRequest(
                  props.request._id,
                  props.request.sender._id
                );
              }}
            >
              Confirm
            </div>
            <div
              className="friend-request-card-btn-decline"
              onClick={() => {
                // setUnfriendModalOpen(true);
                props.declineRequest(props.request._id);
              }}
            >
              Delete
            </div>
          </div>
        ) : props.type == "sentReq" ? (
          <div className="friend-request-card-btn-cont">
            <div className="friend-request-card-btn-pending">
              Request Pending
            </div>
            <div
              className="friend-request-card-btn-cancel"
              onClick={() => {
                props.cancelRequest(props.request._id);
              }}
            >
              Cancel
            </div>
          </div>
        ) : props.type == "noReq" ? (
          <div className="user-info-add-friend-manage-cont">
            <div
              className="user-info-add-friend"
              onClick={() => {
                props.sendRequest(props.userProfile);
              }}
            >
              + Add Friend
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Card;
