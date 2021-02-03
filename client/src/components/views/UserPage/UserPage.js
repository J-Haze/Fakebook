import React from "react";
import Card from "../HomePage/Sections/Card.js";

import CurrentUserPage from "./PageType/CurrentUserPage.js"
import FriendPage from "./PageType/FriendPage.js";
import NonFriendPage from "./PageType/NonFriendPage.js";

import { useState, useEffect } from "react";
import Axios from "axios";

function UserPage(props) {
  const [userBlogs, setUserBlogs] = useState([]);
  const [isUserPage, setIsUserPage] = useState(false);
  const [blogCount, setBlogCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [pageType, setPageType] = useState("NonFriendPage");

  useEffect(() => {
    if (props._id === props.currentUser._id) {
      setPageType("CurrentUserPage");
    } else if (props.currentUser.friendList.indexOf(props._id) != -1) {
      setPageType("FriendPage");
    } else {
      setPageType("NonFriendPage");
    }
  }, [props._id, props.currentUser._id, props.currentUser.friendList]);

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

  return (
    <div id="user-page">
      {pageType == "CurrentUserPage" ? (
        <CurrentUserPage
          currentUser={props.currentUser}
          fetchPosts={props.fetchPosts}
          displayedPosts={props.displayedPosts}
        />
      ) : pageType == "FriendPage" ? (
        <FriendPage
          currentUser={props.currentUser}
          fetchPosts={props.fetchPosts}
        />
      ) : (
        <NonFriendPage
          currentUser={props.currentUser}
          fetchPosts={props.fetchPosts}
        />
      )}
    </div>
  );
}

export default UserPage;
