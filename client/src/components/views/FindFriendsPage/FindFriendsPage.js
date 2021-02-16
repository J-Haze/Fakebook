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
    console.log("Running")
    let nonFriendsArr = props.allUsers;
    console.log("nonFriendsArr", nonFriendsArr);
    console.log("props.allUsers", props.allUsers);

    if (
      nonFriendsArr == undefined ||
      nonFriendsArr.length == 0 ||
      nonFriendsArr == null ||
      nonFriendsArr == ""
    ) {
      //This shouldn't happen because there will always be you as the user
      console.log("Error- No user list")
      console.log("nonFriendsArr2", nonFriendsArr);
      setNonFriends(nonFriendsArr);
      return;
    }

    console.log("nonfriend here")

    //Remove currentUser from list
    for (let i = nonFriendsArr.length - 1; i >= 0; i--) {
      if (nonFriendsArr[i]._id == props.currentUser._id) {
        console.log("Splicing1", nonFriendsArr[i]);
        nonFriendsArr.splice(i, 1);
      }
    }

    setNonFriends(nonFriendsArr);

    if (
      props.currentUser.friendList == undefined ||
      props.currentUser.friendList.length == 0 ||
      props.currentUser.friendList == null ||
      props.currentUser.friendList == ""
    ) {
      console.log(
        "props.currentUser.friendList error",
        props.currentUser.friendList
      );
      setNonFriends(nonFriendsArr);
    } else {
      console.log("T Non Friend Arr", nonFriendsArr);
      console.log(
        "T props.currentUser.friendList",
        props.currentUser.friendList
      );

      for (let i = nonFriendsArr.length - 1; i >= 0; i--) {
        console.log("xi", nonFriendsArr[i]._id);
        for (let j = props.currentUser.friendList.length - 1; j >= 0; j--) {
          console.log("xj", props.currentUser.friendList[j]);
          if (nonFriendsArr[i]._id == props.currentUser.friendList[j]._id) {
            console.log("Splicing2", nonFriendsArr[i]);
            nonFriendsArr.splice(i, 1);
          }
        }
      }
      setNonFriends(nonFriendsArr);

      console.log("T2 Non Friend Arr", nonFriendsArr);
      console.log(
        "T2 props.currentUser.friendList",
        props.currentUser.friendList
      );
    }
    setNonFriends(nonFriendsArr);

    //Remove sent requests from list
    if (
      props.sentRequests == undefined ||
      props.sentRequests.length == 0 ||
      props.sentRequests == null ||
      props.sentRequests == ""
    ) {
      setNonFriends(nonFriendsArr);
    } else {
      for (let i = nonFriendsArr.length - 1; i >= 0; i--) {
        for (let j = props.sentRequests.length - 1; j >= 0; j--) {
          // console.log(
          //   "loop",
          //   i,
          //   nonFriendsArr[i],
          //   j,
          //   props.sentRequests[j]
          // );
          if (nonFriendsArr[i]._id == props.sentRequests[j].receiver._id) {
            console.log("Splicing3", nonFriendsArr[i]);
            nonFriendsArr.splice(i, 1);
          }
        }
      }
    }
    setNonFriends(nonFriendsArr);

    //Remove received requests from list
    if (
      props.receivedRequests == undefined ||
      props.receivedRequests.length == 0 ||
      props.receivedRequests == null ||
      props.receivedRequests == ""
    ) {
      setNonFriends(nonFriendsArr);
    } else {
      for (let i = nonFriendsArr.length - 1; i >= 0; i--) {
        for (let j = props.receivedRequests.length - 1; j >= 0; j--) {
          // console.log(
          //   "loop",
          //   i,
          //   nonFriendsArr[i],
          //   j,
          //   props.sentRequests[j]
          // );
          if (nonFriendsArr[i]._id == props.receivedRequests[j].sender._id) {
            console.log("Splicing4", nonFriendsArr[i]);
            nonFriendsArr.splice(i, 1);
          }
        }
      }
    }

    console.log("Final NonFriendArray", nonFriendsArr);
    setNonFriends(nonFriendsArr);
  }, [
    props.currentUser,
    props.allUsers,
    props.receivedRequests,
    props.sentRequests,
  ]);

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
                      key={request.sender._id}
                      user={request.sender}
                      request={request}
                      type={"receivedReq"}
                      sendRequest={props.sendRequest}
                      cancelRequest={props.cancelRequest}
                      acceptRequest={props.acceptRequest}
                      declineRequest={props.declineRequest}
                      sendNotification={props.sendNotification}
                    />
                  ) : (
                    ""
                  )
                )}

            {!props.sentRequests
              ? ""
              : props.sentRequests.map((request) =>
                  request.receiver.isPublished ? (
                    <FindFriendsCard
                      key={request.receiver._id}
                      user={request.receiver}
                      request={request}
                      type={"sentReq"}
                      sendRequest={props.sendRequest}
                      cancelRequest={props.cancelRequest}
                      acceptRequest={props.acceptRequest}
                      declineRequest={props.declineRequest}
                      sendNotification={props.sendNotification}
                    />
                  ) : (
                    ""
                  )
                )}

            {!nonFriends
              ? ""
              : nonFriends.map((user) =>
                  user.isPublished ? (
                    <FindFriendsCard
                      key={user._id}
                      user={user}
                      type={"noReq"}
                      sendRequest={props.sendRequest}
                      cancelRequest={props.cancelRequest}
                      acceptRequest={props.acceptRequest}
                      declineRequest={props.declineRequest}
                      sendNotification={props.sendNotification}
                    />
                  ) : (
                    ""
                  )
                )}
          </div>
          {(nonFriends.length == 0 ||
            nonFriends == undefined ||
            nonFriends == null ||
            nonFriends == "") && (
            <div className="no-others-to-show">No Other Users</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindFriendsPage;
