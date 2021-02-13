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



  useEffect(() => {
    let nonFriendsArr = props.allUsers;

    if (
      nonFriendsArr.length == 0 ||
      nonFriendsArr == undefined ||
      nonFriendsArr == null ||
      nonFriendsArr == ""
    ) {
      setNonFriends(nonFriendsArr);
      return;
    }

    for (let i = nonFriendsArr.length - 1; i >= 0; i--) {

      //Remove currentUser from list
      if (nonFriendsArr[i]._id == props.currentUser._id) {
        nonFriendsArr.splice(i, 1);
      }

      //Remove friends from list
      for (let j = props.currentUser.friendList; j >= 0; j--) {
        if (nonFriendsArr[i]._id == props.currentUser.friendList[j]._id) {
          nonFriendsArr.splice(i, 1);
        }
      }

      //Remove sent requests from list

      //Remove received requests from list
    }
  }, [props.currentUser, props.allUsers]);

  return (
    <div id="friend-list-page-cont">
      <div id="friend-list-page">
        <div className="friend-list-cont">
          {/* Something for if there's no friends */}
          <div className="friend-list-header">Find friends:</div>
          <div className="friend-list-card-cont">
            {!props.receivedRequests
              ? ""
              : props.receivedRequests.map((request) =>
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

            {!props.nonFriends
              ? ""
              : props.sentRequests.map((request) =>
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

            {!nonFriends
              ? ""
              : nonFriends.map((user) =>
                  user.isPublished ? (
                    <FindFriendsCard user={user} type={"noReq"} />
                  ) : (
                    ""
                  )
                )}
          </div>
          {(nonFriends.length == 0 ||
            nonFriends == undefined ||
            nonFriends == null ||
            nonFriends == "") && (
            <div className="no-others-to-show">
              No Other Users
              {/* <FindFriendsBtn />  */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindFriendsPage;
