import React from "react";
import Card from "../HomePage/Sections/Card.js";

import CurrentUserPage from "./PageType/CurrentUserPage/CurrentUserPage.js";
import FriendPage from "./PageType/FriendPage.js";
import NonFriendPage from "./PageType/NonFriendPage.js";

import { useEffect } from "react";

function UserPage(props) {
  useEffect(() => {
    if (props.userProfile._id === props.currentUser._id) {
      props.setPageType("CurrentUserPage");
    } else {
      if (
        props.currentUser.friendList.find(
          (obj) => obj._id == props.userProfile._id
        )
      ) {
        props.setPageType("FriendPage");
      } else {
        props.setPageType("NonFriendPage");
      }
    }
  }, [
    props.userProfile._id,
    props.currentUser._id,
    props.currentUser.friendList,
    props.allUsers,
  ]);

  useEffect(() => {
    return function cleanup() {
      props.fetchUsers();
      props.fetchPosts();
    };
  }, []);

  return (
    <div id="user-page">
      {props.pageType == "CurrentUserPage" ? (
        <CurrentUserPage
          currentUser={props.currentUser}
          fetchPosts={props.fetchPosts}
          displayedPosts={props.displayedPosts}
          createPostModalOpen={props.createPostModalOpen}
          setCreatePostModalOpen={props.setCreatePostModalOpen}
          sendRequest={props.sendRequest}
          cancelRequest={props.cancelRequest}
          acceptRequest={props.acceptRequest}
          declineRequest={props.declineRequest}
          submitUnfriend={props.submitUnfriend}
          sendingRequest={props.sendingRequest}
          sendNotification={props.sendNotification}
          setCurrentUser={props.setCurrentUser}
          isLoggedIn={props.isLoggedIn}
          setIsLoggedIn={props.setIsLoggedIn}
        />
      ) : props.pageType == "FriendPage" ? (
        <FriendPage
          currentUser={props.currentUser}
          fetchPosts={props.fetchPosts}
          displayedPosts={props.displayedPosts}
          userProfile={props.userProfile}
          sendRequest={props.sendRequest}
          cancelRequest={props.cancelRequest}
          acceptRequest={props.acceptRequest}
          declineRequest={props.declineRequest}
          submitUnfriend={props.submitUnfriend}
          sendingRequest={props.sendingRequest}
          submitUnfriend={props.submitUnfriend}
          sendNotification={props.sendNotification}
        />
      ) : (
        <NonFriendPage
          currentUser={props.currentUser}
          fetchPosts={props.fetchPosts}
          displayedPosts={props.displayedPosts}
          userProfile={props.userProfile}
          sendRequest={props.sendRequest}
          cancelRequest={props.cancelRequest}
          acceptRequest={props.acceptRequest}
          declineRequest={props.declineRequest}
          submitUnfriend={props.submitUnfriend}
          sendingRequest={props.sendingRequest}
          sendNotification={props.sendNotification}
        />
      )}
    </div>
  );
}

export default UserPage;
