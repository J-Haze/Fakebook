import React from "react";
import Card from "../HomePage/Sections/Card.js";

import CurrentUserPage from "./PageType/CurrentUserPage/CurrentUserPage.js";
import FriendPage from "./PageType/FriendPage.js";
import NonFriendPage from "./PageType/NonFriendPage.js";

import { useState, useEffect } from "react";
import Axios from "axios";

function UserPage(props) {
  const [userBlogs, setUserBlogs] = useState([]);
  const [isUserPage, setIsUserPage] = useState(false);
  const [blogCount, setBlogCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // const [pageType, setPageType] = useState("NonFriendPage");
  // const [pageType, setPageType] = useState("");

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
    // console.log("PageType:", props.pageType)
  }, [
    props.userProfile._id,
    props.currentUser._id,
    props.currentUser.friendList,
    // props.updateUserPage
  ]);

  // console.log("user1", props.user)
  // console.log("user2", props.friendList);

  //   const fetchUserBlogs = () => {
  //     Axios.get(`/user/${props._id}/posts`).then((res) => {
  //       let userBlogsArray = res.data;
  //       let reversedArray = userBlogsArray.reverse();
  //       setUserBlogs(reversedArray);

  //       let blogCountVar = 0;
  //       if (reversedArray.length > 0) {
  //         reversedArray.forEach(function (blog) {
  //           if (blog.isPublished) {
  //             blogCountVar++;
  //           }
  //         });
  //       }
  //       setBlogCount(blogCountVar);
  //       setLoading(false);
  //     });
  //   };

  //   useEffect(() => {
  //     fetchUserBlogs();
  //   }, []);

  //   useEffect(() => {
  //     if (props.currentUser) {
  //       if (props.currentUser.username === props.username) {
  //         setIsUserPage(true);
  //         props.setIsViewingProfile(true);
  //       } else {
  //         setIsUserPage(false);
  //       }
  //     }
  //     return function cleanup() {
  //       props.setIsViewingProfile(false);
  //     };
  //   }, [props.currentUser, props.username]);

  //code that takes displayedPosts and outputs user posts

  // console.log("received requests 2", props.receivedRequests);

  // console.log("received requests count1", props.receivedRequestsCount);

  

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
          refTarget={props.refTarget}
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
