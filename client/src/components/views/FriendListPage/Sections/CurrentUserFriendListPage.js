import React from "react";

// import CurrentUserPage from "./PageType/CurrentUserPage/CurrentUserPage.js";
// import FriendPage from "./PageType/FriendPage.js";
// import NonFriendPage from "./PageType/NonFriendPage.js";

import { useState, useEffect } from "react";
import Axios from "axios";

function CurrentUserFriendListPage(props) {

  // Have an Add Friends Button if you don't have friends!

  return (
    <div id="current-user-friend-list-page">
      Current User Friend List Page
      {props.currentUser.friendList.map((friend) =>
        friend.isPublished ? (
          <div className="friend-card-cont" key={friend._id}>
            {/* <Link className="link" to={`/user/${friend._id}`}>
              <img
                className="prof-pic-friendList"
                alt={`profile-pic-user-${friend.firstname}-${friend.lastname}`}
                src={`http://localhost:5000/uploads/${friend.photo.filename}`}
              />
            </Link> */}
            <div>
              {friend.firstname} {friend.lastname}
            </div>
          </div>
        ) : (
          ""
        )
      )}
    </div>
  );
}

export default CurrentUserFriendListPage;
