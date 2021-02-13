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
  const history = useHistory();

  console.log("props.receivedRequests", props.receivedRequests);

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

            {props.allUsers.map((user) =>
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
