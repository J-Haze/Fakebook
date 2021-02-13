import React from "react";

// import CurrentUserPage from "./PageType/CurrentUserPage/CurrentUserPage.js";
// import FriendPage from "./PageType/FriendPage.js";
// import NonFriendPage from "./PageType/NonFriendPage.js";

import { useState, useEffect } from "react";
import Axios from "axios";

function CurrentUserFriendListPage(props) {
  // Have an Add Friends Button if you don't have friends!



  return (
    <div id="current-user-friend-list-side">
      <div id="current-user-fl-side-header">Friends:</div>
      <div
        id="current-user-fl-side-requests-cont"
        className="current-user-fl-side-cont"
      >
        <div id="current-user-fl-side-subheader">
          {props.recievedRequestsCount} Friend Requests
        </div>
        {!props.recievedRequestsCount ? (
          <div className="no-new-requests">No new requests</div>
        ) : (
          ""
        )}
      </div>
      <div
        id="current-user-fl-side-pending-cont"
        className="current-user-fl-side-cont"
      >
        <div id="current-user-fl-side-subheader">{props.sentRequestsCount} Requests Pending</div>
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
