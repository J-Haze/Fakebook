import React from "react";
import { useState, useEffect } from "react";
import "./FindFriendsPage.css";

import FindFriendsCard from "./Sections/FindFriendsCard.js";

function FindFriendsPage(props) {
  const [nonFriends, setNonFriends] = useState([]);

  useEffect(() => {
    let nonFriendsArr = props.allUsers;

    if (
      nonFriendsArr == undefined ||
      nonFriendsArr.length == 0 ||
      nonFriendsArr == null ||
      nonFriendsArr == ""
    ) {
      //This shouldn't happen because there will always be you as the user
      setNonFriends("");
      return;
    }

    if (
      nonFriendsArr.length == 1
    ) {
      //You are the only user
      setNonFriends("");
      return;
    }

    //Remove currentUser from array
    for (let i = nonFriendsArr.length - 1; i >= 0; i--) {
      if (nonFriendsArr[i]._id == props.currentUser._id) {
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
      setNonFriends(nonFriendsArr);
    } else {

      for (let i = nonFriendsArr.length - 1; i >= 0; i--) {
        for (let j = props.currentUser.friendList.length - 1; j >= 0; j--) {
          if (nonFriendsArr[i]._id == props.currentUser.friendList[j]._id) {
            nonFriendsArr.splice(i, 1);
          }
        }
      }

      setNonFriends(nonFriendsArr);
    }
    setNonFriends(nonFriendsArr);

    //Remove sent requests from array
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
          if (nonFriendsArr[i]._id == props.sentRequests[j].receiver._id) {
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
          if (nonFriendsArr[i]._id == props.receivedRequests[j].sender._id) {
            nonFriendsArr.splice(i, 1);
          }
        }
      }
    }

    setNonFriends(nonFriendsArr);

    // return(props.fetchUsers)
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
          <div className="friend-list-header">Find friends:</div>
          <div className="friend-list-card-cont">
            {props.receivedRequests.length == 0 ||
            props.receivedRequests == undefined ||
            props.receivedRequests == null ||
            props.receivedRequests == "" ? (
              ""
            ) : (
              props.receivedRequests.map((request) =>
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
              )
            )}

            {props.sentRequests.length == 0 ||
            props.sentRequests == undefined ||
            props.sentRequests == null ||
            props.sentRequests == "" ? (
              ""
            ) : (
              props.sentRequests.map((request) =>
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
              )
            )}

            {nonFriends.length == 0 ||
            nonFriends == undefined ||
            nonFriends == null ||
            nonFriends == "" ? (
              ""
            ) : (
              nonFriends.map((user) =>
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
