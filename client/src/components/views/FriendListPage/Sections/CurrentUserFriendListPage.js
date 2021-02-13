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
        {props.receivedRequests == "" ? (
          <div className="no-new-requests">No new requests</div>
        ) : (
          props.receivedRequests.map((request) =>
            request.sender.isPublished ? (
              <div className="friend-request-card" key={request._id}>
                <Link className="link" to={`/user/${request.sender._id}`}>
                  <img
                    className="prof-pic-friendList-request-page"
                    alt={`profile-pic-user-${request.sender.firstname}-${request.sender.lastname}`}
                    src={`http://localhost:5000/uploads/${request.sender.photo.filename}`}
                  />
                </Link>
                <div className="friend-request-card-info">
                  <div
                    className="friend-request-card-username"
                    onClick={() => {
                      history.push(`/user/${request.sender._id}`);
                    }}
                  >
                    {request.sender.firstname} {request.sender.lastname}
                  </div>
                  {/* <div className="friend-request-card-location">
                    {request.sender.location}
                  </div> */}
                  <div className="friend-request-card-btn-cont">
                    <div
                      className="friend-request-card-btn-confirm"
                      onClick={() => {
                        // setUnfriendModalOpen(true);
                        props.acceptRequest(request._id, request.sender._id);
                      }}
                    >
                      Confirm
                    </div>
                    <div
                      className="friend-request-card-btn-decline"
                      onClick={() => {
                        // setUnfriendModalOpen(true);
                        props.declineRequest(request._id);
                      }}
                    >
                      Delete
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )
          )
        )}
      </div>
      <div
        id="current-user-fl-side-pending-cont"
        className="current-user-fl-side-cont"
      >
        <div id="current-user-fl-side-subheader-pending">
          {props.sentRequestsCount} Requests Pending
        </div>

        {/* {!props.sentRequestsCount ? (
          <div className="no-new-requests">No pending requests</div>
        ) : (
          ""
        )} */}

        {props.sentRequestsCount == "" ? (
          <div className="no-new-requests">No pending requests</div>
        ) : (
          props.sentRequests.map((request) =>
            request.reciever.isPublished ? (
              <div className="friend-request-card" key={request._id}>
                <Link className="link" to={`/user/${request.reciever._id}`}>
                  <img
                    className="prof-pic-friendList-request-page"
                    alt={`profile-pic-user-${request.reciever.firstname}-${request.reciever.lastname}`}
                    src={`http://localhost:5000/uploads/${request.reciever.photo.filename}`}
                  />
                </Link>
                <div className="friend-request-card-info">
                  <div
                    className="friend-request-card-username"
                    onClick={() => {
                      history.push(`/user/${request.reciever._id}`);
                    }}
                  >
                    {request.reciever.firstname} {request.reciever.lastname}
                  </div>
                  {/* <div className="friend-request-card-location">
                    {request.reciever.location}
                  </div> */}
                  <div className="friend-request-card-btn-cont">
                    <div
                      className="friend-request-card-btn-pending"
                    >
                      Request Pending
                    </div>
                    <div
                      className="friend-request-card-btn-cancel"
                      onClick={() => {
                        props.cancelRequest(request._id);
                      }}
                    >
                      Cancel
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )
          )
        )}

        {/* <FindFriendsBtn />  */}
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
