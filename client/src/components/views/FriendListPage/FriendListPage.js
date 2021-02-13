import React from "react";
// import Card from "../HomePage/Sections/Card.js";
import { Link } from "react-router-dom";

import "./FriendListPage.css";

import { useHistory } from "react-router-dom";

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

  const history = useHistory();

  console.log("user", props.user._id);
  console.log(props.currentUser._id);

  useEffect(() => {
    if (props.user._id === props.currentUser._id) {
      setPageType("CurrentUserFriendListPage");
    } else {
      if (
        props.currentUser.friendList.find((obj) => obj._id == props.user._id)
      ) {
        setPageType("FriendListPage");
      }
    }
  }, [props.user._id, props.currentUser._id, props.currentUser.friendList]);

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

  console.log("received requests 2", props.receivedRequests);

  console.log("received requests count1", props.receivedRequestsCount);

  return (
    <div id="friend-list-page-cont">
      {pageType == "CurrentUserFriendListPage" && (
        <CurrentUserFriendListPage
          currentUser={props.currentUser}
          receivedRequests={props.receivedRequests}
          setReceivedRequests={props.setReceivedRequests}
          receivedRequestsCount={props.receivedRequestsCount}
          setReceivedRequestsCount={props.setReceivedRequestsCount}
          sentRequests={props.sentRequests}
          setSentRequests={props.setSentRequests}
          sentRequestsCount={props.sentRequestsCount}
          setSentRequestsCount={props.setSentRequestsCount}
          // fetchPosts={props.fetchPosts}
          // displayedPosts={props.displayedPosts}
          // createPostModalOpen={props.createPostModalOpen}
          // setCreatePostModalOpen={props.setCreatePostModalOpen}
        />
      )}
      <div id="friend-list-page">
        <div className="friend-list-cont">
          {/* Something for if there's no friends */}
          <div className="friend-list-header">
            {props.user.firstname} {props.user.lastname}'s friends:
          </div>
          <div className="friend-list-card-cont">
            {props.user.friendList.length == 0 && (
              <div className="no-friends-to-show">
                No Friends To Show
                {/* <FindFriendsBtn />  */}
              </div>
            )}
            {props.user.friendList.map((friend) =>
              friend.isPublished ? (
                <div className="friend-card" key={friend._id}>
                  <Link className="link" to={`/user/${friend._id}`}>
                    <img
                      className="prof-pic-friendList-page"
                      alt={`profile-pic-user-${friend.firstname}-${friend.lastname}`}
                      src={`http://localhost:5000/uploads/${friend.photo.filename}`}
                    />
                  </Link>
                  <div className="friend-card-info">
                    <div
                      className="friend-card-username"
                      onClick={() => {
                        history.push(`/user/${friend._id}`);
                      }}
                    >
                      {friend.firstname} {friend.lastname}
                    </div>
                    <div className="friend-card-location">
                      {friend.location}
                    </div>
                  </div>
                </div>
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

export default FriendListPage;
