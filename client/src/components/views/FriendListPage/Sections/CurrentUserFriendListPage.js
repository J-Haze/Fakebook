import React, { useState, useEffect } from "react";

// import CurrentUserPage from "./PageType/CurrentUserPage/CurrentUserPage.js";
// import FriendPage from "./PageType/FriendPage.js";
// import NonFriendPage from "./PageType/NonFriendPage.js";

import Axios from "axios";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

function CurrentUserFriendListPage(props) {
  // Have an Add Friends Button if you don't have friends!

  console.log("received requests count", props.receivedRequestsCount);
  const history = useHistory();

  return (
    <div id="current-user-friend-list-side">
      <div id="current-user-fl-side-header">Friends:</div>
      <div
        id="current-user-fl-side-requests-cont"
        className="current-user-fl-side-cont"
      >
        <div id="current-user-fl-side-subheader">
          {props.receivedRequestsCount} Friend Requests
        </div>
        {!props.receivedRequests ? (
          <div className="no-new-requests">No new requests</div>
        ) : (
            props.receivedRequests.map((request) => (
          request.sender.isPublished ? (
            <div className="friend-card" key={request._id}>
              <Link className="link" to={`/user/${request.sender._id}`}>
                <img
                  className="prof-pic-friendList-page"
                  alt={`profile-pic-user-${request.sender.firstname}-${request.sender.lastname}`}
                  src={`http://localhost:5000/uploads/${request.sender.photo.filename}`}
                />
              </Link>
              <div className="friend-card-info">
                <div
                  className="friend-card-username"
                  onClick={() => {
                    history.push(`/user/${request.sender._id}`);
                  }}
                >
                  {request.sender.firstname} {request.sender.lastname}
                </div>
                <div className="friend-card-location">{request.sender.location}</div>
              </div>
            </div>)
           : (
            ""
                )
              ))
        )}
      </div>
      <div
        id="current-user-fl-side-pending-cont"
        className="current-user-fl-side-cont"
      >
        <div id="current-user-fl-side-subheader">
          {props.sentRequestsCount} Requests Pending
        </div>

        {/* {props.user.friendList.map((friend) =>
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
                <div className="friend-card-location">{friend.location}</div>
              </div>
            </div>
          ) : (
            <div className="no-friends-to-show">"No Friends To Show"</div>
          )
        )} */}

        {!props.sentRequestsCount ? (
          <div className="no-new-requests">No pending requests</div>
        ) : (
          ""
        )}
      </div>
    </div>

    // <div id="current-user-friend-list-page">
    //   Current User Friend List Page
    //   {props.currentUser.friendList.map((friend) =>
    //     friend.isPublished ? (
    //       <div className="friend-card-cont" key={friend._id}>
    //         {/* <Link className="link" to={`/user/${friend._id}`}>
    //           <img
    //             className="prof-pic-friendList"
    //             alt={`profile-pic-user-${friend.firstname}-${friend.lastname}`}
    //             src={`http://localhost:5000/uploads/${friend.photo.filename}`}
    //           />
    //         </Link> */}
    //         <div>
    //           {friend.firstname} {friend.lastname}
    //         </div>
    //       </div>
    //     ) : (
    //       ""
    //     )
    //   )}
    // </div>
  );
}

export default CurrentUserFriendListPage;
