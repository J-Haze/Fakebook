import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";

import Card from "../../../HomePage/Sections/Card.js";
import EditUserModal from "./Sections/EditUserModal.js";

import "../../UserPage.css";

function CurrentUserPage(props) {
  const [userPosts, setUserPosts] = useState([]);

  const [friendCount, setFriendCount] = useState(0);

  // const [createPostModalOpen, setCreatePostModalOpen] = useState(true);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);

  useEffect(() => {
    let userPostArray = [];

    let ownPosts = [];
    for (let i = 0; i < props.displayedPosts.length; i++) {
      //   console.log(i, props.displayedPosts[i]);
      //   console.log(props.displayedPosts.author);
      //   console.log(props.currentUser);
      if (props.displayedPosts[i].author._id == props.currentUser._id) {
        // console.log("match");
        // console.log(props.displayedPosts[i].author._id);
        // console.log(props.currentUser._id);
        if (ownPosts.length == 0 || ownPosts == undefined) {
          ownPosts = [props.displayedPosts[i]];
        } else {
          ownPosts.push(props.displayedPosts[i]);
        }
      }
    }
    // console.log("ownPosts end", ownPosts);
    // console.log("displayedPosts end", props.displayedPosts);
    setUserPosts(ownPosts);
    // setDisplayedComments(res.data);
  }, [props.displayedPosts]);

  function calculateFriendCount() {
    if (
      props.currentUser.friendList.length == 0 ||
      props.currentUser.friendList.length == undefined
    ) {
      setFriendCount(0);
      return;
    } else {
      setFriendCount(props.currentUser.friendList.length);
    }
  }

  useEffect(() => {
    calculateFriendCount();
  }, []);

  return (
    <div id="current-user-page">
      {editUserModalOpen && (
        <EditUserModal
          // createPostModalOpen={createPostModalOpen}
          // setCreatePostModalOpen={setCreatePostModalOpen}
          // currentUser={currentUser}
          // fetchPosts={fetchPosts}
        />
      )}
      {/* <div id="user-page-content-cont"> */}
      <div id="user-info-cont">
        <div className="prof-icon-big"></div>
        <div className="user-card-username">
          {props.currentUser.firstname} {props.currentUser.lastname}
        </div>

        <div id="user-info-box">
          {/* <span
            // className="del-post-x"
            onClick={(event) => {
              //   event.stopPropagation();
              //   setDeletePostModalOpen(true);
            }}
          >
            Edit Profile
          </span> */}

          <div id="bio-cont">
            <div className="flex">
              <div id="bio-header" className="user-info-header">
                Bio
              </div>
              <span
                className="edit-user-prof"
                onClick={(event) => {
                  //   event.stopPropagation();
                  //   setDeletePostModalOpen(true);
                }}
              >
                Edit Profile
              </span>
            </div>
            {/* Edit profile float */}
            <div id="bio" className="user-info-text">
              {props.currentUser.bio}
            </div>
          </div>

          <div id="location-cont">
            <div id="location-header" className="user-info-header">
              Location
            </div>
            {/* Edit profile float */}
            <div id="location" className="user-info-text">
              {props.currentUser.location}
            </div>
          </div>

          <div id="occupation-cont">
            <div id="occupation-header" className="user-info-header">
              Occupation
            </div>
            {/* Edit profile float */}
            <div id="occupation" className="user-info-text">
              {props.currentUser.occupation}
            </div>
          </div>
        </div>
        <div id="user-friends-box">
          <div className="flex">
            <div id="friend-header">Friends</div>
            <span
              className="see-all-friends"
              onClick={(event) => {
                //   event.stopPropagation();
                //   setDeletePostModalOpen(true);
              }}
            >
              See All Friends
            </span>
          </div>
          {friendCount == 1 ? (
            <div id="friend-text">1 friend</div>
          ) : (
            <div id="friend-text">{friendCount} friends</div>
          )}
          {props.currentUser.friendList.length > 0 && (
            <div id="friend-icon-cont">
              {props.currentUser.friendList.map((friend) =>
                friend.isPublished ? (
                  <div className="friend-icon-box">
                    <div className="prof-icon-friendList">
                      {/* <ProfileImage /> */}
                    </div>
                    <div>
                      {friend.firstname} {friend.lastname}
                    </div>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          )}
        </div>
      </div>
      <div id="user-post-cont">
        <div id="new-post-card">
          <div id="new-post-card-top" className="new-post-card-row">
            <div className="prof-icon">{/* <ProfileImage /> */}</div>
            <div
              id="woym-btn"
              onClick={() => {
                props.setCreatePostModalOpen(true);
              }}
            >
              What's on your mind, {props.currentUser.firstname}?
            </div>
          </div>
          {/* <div
                id="new-post-card-bottom"
                className="new-post-card-row"
              ></div> */}
        </div>
        {/* <div className="main-subtitle">All Posts:</div> */}
        {userPosts.map((post) =>
          post.isPublished ? (
            <Card
              key={post._id}
              post={post}
              currentUser={props.currentUser}
              fetchPosts={props.fetchPosts}
            />
          ) : (
            ""
          )
        )}
      </div>
      {/* </div> */}
    </div>
  );
}

export default CurrentUserPage;
