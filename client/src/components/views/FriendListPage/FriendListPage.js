import React from "react";
import Card from "../HomePage/Sections/Card.js";

// import CurrentUserPage from "./PageType/CurrentUserPage/CurrentUserPage.js";
// import FriendPage from "./PageType/FriendPage.js";
// import NonFriendPage from "./PageType/NonFriendPage.js";

import CurrentUserFriendListPage from "./Sections/CurrentUserFriendListPage.js";

import { useState, useEffect } from "react";
import Axios from "axios";

function FriendListPage(props) {
  const [userBlogs, setUserBlogs] = useState([]);
  const [isUserPage, setIsUserPage] = useState(false);
  const [blogCount, setBlogCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [pageType, setPageType] = useState("FriendListPage");

  console.log("user", props.user._id);
  console.log(props.currentUser._id);

  useEffect(() => {
    if (props.user._id === props.currentUser._id) {
      setPageType("CurrentUserFriendListPage");
    } else {
      if (
        props.currentUser.friendList.find(
          (obj) => obj._id == props.user._id
        )
      ) {
        setPageType("FriendListPage");
      }
    }
  }, [
    props.user._id,
    props.currentUser._id,
    props.currentUser.friendList,
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

  return (
    <div id="user-page">
      {pageType == "CurrentUserFriendListPage" ? (
        <CurrentUserFriendListPage
        // currentUser={props.currentUser}
        // fetchPosts={props.fetchPosts}
        // displayedPosts={props.displayedPosts}
        // createPostModalOpen={props.createPostModalOpen}
        // setCreatePostModalOpen={props.setCreatePostModalOpen}
        />
      ) : (
        <div>Friend List Page</div>
      )}
    </div>
  );
}

export default FriendListPage;
