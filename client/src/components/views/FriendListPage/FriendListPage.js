import React from "react";
import { Link } from "react-router-dom";

import "./FriendListPage.css";

import { useHistory } from "react-router-dom";

import CurrentUserFriendListPage from "./Sections/CurrentUserFriendListPage.js";

import { useState, useEffect } from "react";

function FriendListPage(props) {
  const [pageType, setPageType] = useState("FriendListPage");

  const history = useHistory();

  useEffect(() => {
    if (props.user._id === props.currentUser._id) {
      setPageType("CurrentUserFriendListPage");
    } else {
      if (
        props.currentUser.friendList.find((obj) => obj._id == props.user._id)
      ) {
        setPageType("FriendListPage");
      }
    }
  }, [props.user._id, props.currentUser._id, props.currentUser.friendList]);

  return (
    <div id="friend-list-page-cont">
      {pageType == "CurrentUserFriendListPage" && (
        <CurrentUserFriendListPage
          currentUser={props.currentUser}
          receivedRequests={props.receivedRequests}
          setReceivedRequests={props.setReceivedRequests}
          receivedRequestsCount={props.receivedRequestsCount}
          setReceivedRequestsCount={props.setReceivedRequestsCount}
          sentRequests={props.sentRequests}
          setSentRequests={props.setSentRequests}
          sentRequestsCount={props.sentRequestsCount}
          setSentRequestsCount={props.setSentRequestsCount}
          sendRequest={props.sendRequest}
          cancelRequest={props.cancelRequest}
          acceptRequest={props.acceptRequest}
          declineRequest={props.declineRequest}
          submitUnfriend={props.submitUnfriend}
          sendingRequest={props.sendingRequest}
          sendNotification={props.sendNotification}
        />
      )}
      <div id="friend-list-page">
        <div className="friend-list-cont">
          <div className="friend-list-header">
            {props.user.firstname} {props.user.lastname}'s friends:
          </div>
          <div className="friend-list-card-cont">
            {props.user.friendList.length == 0 && (
              <div className="no-friends-to-show">
                No Friends To Show
              </div>
            )}
            {props.user.friendList.map((friend) =>
              friend.isPublished ? (
                <div className="friend-card" key={friend._id}>
                  <Link className="link" to={`/user/${friend._id}`}>
                    <img
                      className="prof-pic-friendList-page"
                      alt={`profile-pic-user-${friend.firstname}-${friend.lastname}`}
                      src={`http://localhost:5000/uploads/${friend.photo.filename}`}
                    />
                  </Link>
                  <div className="friend-card-info">
                    <div
                      className="friend-card-username"
                      onClick={() => {
                        history.push(`/user/${friend._id}`);
                      }}
                    >
                      {friend.firstname} {friend.lastname}
                    </div>
                    <div className="friend-card-location">
                      {friend.location}
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendListPage;
