import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";

// import Card from "../HomePage/Sections/Card.js";
import { Link } from "react-router-dom";

import "./FindFriendsPage.css";

// import "./FriendListPage.css";

import FindFriendsCard from "./Sections/FindFriendsCard.js";

import { useHistory } from "react-router-dom";

function FindFriendsPage(props) {
  const [nonFriends, setNonFriends] = useState([]);

  const history = useHistory();

  console.log("props.receivedRequests", props.receivedRequests);

  // useEffect(() => {
  //   let nonFriends = props.allUsers;

  //   if (
  //     nonFriends.length == 0 ||
  //     nonFriends == undefined ||
  //     nonFriends == null
  //   ) {
  //     return;
  //   }

  //   for (let i = nonFriends.length - 1; i >= 0; i--) {

  //     //Remove currentUser from list
  //     if (nonFriends[i]._id == props.currentUser._id) {
  //       nonFriends.splice(i, 1);
  //     }

  //     //Remove friends from list
  //     for (let j = props.currentUser.friendList; j >= 0; j--) {
  //       if (nonFriends[i]._id == props.currentUser.friendList[j]._id) {
  //         nonFriends.splice(i, 1);
  //       }
  //     }

  //     //Remove sent requests from list

  //     //Remove received requests from list
  //   }
  // }, [props.currentUser, props.allUsers]);

  return (
    <div id="friend-list-page-cont">
      <div id="friend-list-page">
        <div className="friend-list-cont">
          {/* Something for if there's no friends */}
          <div className="friend-list-header">Find friends:</div>
          <div className="friend-list-card-cont">
            {props.allUsers == 0 && (
              <div className="no-friends-to-show">
                No Other Users
                {/* <FindFriendsBtn />  */}
              </div>
            )}

            {props.receivedRequests.map((request) =>
              request.sender.isPublished ? (
                <FindFriendsCard
                  user={request.sender}
                  request={request}
                  type={"receivedReq"}
                />
              ) : (
                ""
              )
            )}

            {props.sentRequests.map((request) =>
              request.receiver.isPublished ? (
                <FindFriendsCard
                  user={request.receiver}
                  request={request}
                  type={"sentReq"}
                />
              ) : (
                ""
              )
            )}

            {/* {props.allUsers.map((user) => */}
            {props.nonFriends.map((user) =>
              user.isPublished ? (
                <FindFriendsCard user={user} type={"noReq"} />
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

export default FindFriendsPage;
