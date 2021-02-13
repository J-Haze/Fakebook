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
      props.nonFriendsArr == undefined ||
      props.nonFriendsArr.length == 0 ||
      props.nonFriendsArr == null ||
      props.nonFriendsArr == ""
    ) {
      //This shouldn't happen because there will always be you as the user
      setNonFriends(nonFriendsArr);
      return;
    }

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
      setNonFriends(nonFriendsArr);
    } else {
      for (let i = nonFriendsArr.length - 1; i >= 0; i--) {
        for (let j = props.currentUser.friendList; j >= 0; j--) {
          if (nonFriendsArr[i]._id == props.currentUser.friendList[j]._id) {
            console.log("Splicing2", nonFriendsArr[i]);
            nonFriendsArr.splice(i, 1);
          }
        }
      }
      // setNonFriends(nonFriendsArr);
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
        for (let j = props.sentRequests.length; j >= 0; j--) {
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
        for (let j = props.receivedRequests.length; j >= 0; j--) {
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
