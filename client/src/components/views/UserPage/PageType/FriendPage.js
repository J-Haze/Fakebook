import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

import Card from "../..//HomePage/Sections/Card.js";
// import EditUserModal from "../Current/Sections/EditUserModal.js";

import "../UserPage.css";

function FriendPage(props) {
  const [userPosts, setUserPosts] = useState([]);

  const [friendCount, setFriendCount] = useState(0);

  //  const [editUserModalOpen, setEditUserModalOpen] = useState(true);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);

  console.log("user3", props.userProfile);
  // console.log("user4", props.friendList);

  useEffect(() => {
    let userPostArray = [];

    for (let i = 0; i < props.displayedPosts.length; i++) {
      //   console.log(i, props.displayedPosts[i]);
      //   console.log(props.displayedPosts.author);
      //   console.log(props.currentUser);
      if (props.displayedPosts[i].author._id == props.userProfile._id) {
        // console.log("match");
        // console.log(props.displayedPosts[i].author._id);
        // console.log(props.currentUser._id);
        if (userPostArray.length == 0 || userPostArray == undefined) {
          userPostArray = [props.displayedPosts[i]];
        } else {
          userPostArray.push(props.displayedPosts[i]);
        }
      }
    }
    // console.log("userPostArray end", userPostArray);
    // console.log("displayedPosts end", props.displayedPosts);
    setUserPosts(userPostArray);
    // setDisplayedComments(res.data);
  }, [props.displayedPosts]);

  function calculateFriendCount() {
    if (
      props.userProfile.friendList.length == 0 ||
      props.userProfile.friendList.length == undefined
    ) {
      setFriendCount(0);
      return;
    } else {
      setFriendCount(props.userProfile.friendList.length);
    }
  }

  useEffect(() => {
    calculateFriendCount();
  }, []);

  return (
    <div id="current-user-page">
      {/* {editUserModalOpen && (
        <EditUserModal
          // createPostModalOpen={createPostModalOpen}
          setEditUserModalOpen={setEditUserModalOpen}
          currentUser={props.currentUser}
          // fetchPosts={fetchPosts}
        />
      )} */}
      {/* <div id="user-page-content-cont"> */}
      {/* <div className="test"> */}
      <div id="user-info-cont">
        {props.userProfile.photo ? (
          <img
            className="prof-pic-big"
            alt={`profile-pic-user-${props.userProfile.firstname}-${props.userProfile.lastname}`}
            src={`http://localhost:5000/uploads/${props.userProfile.photo.filename}`}
          />
        ) : (
          <div className="prof-icon-big"></div>
        )}

        <div className="user-card-username">
          {props.userProfile.firstname} {props.userProfile.lastname}
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
                  // event.stopPropagation();
                  setEditUserModalOpen(true);
                }}
              >
                Edit Profile
              </span>
            </div>
            {/* Edit profile float */}
            <div id="bio" className="user-info-text">
              {props.userProfile.bio}
            </div>
          </div>

          <div id="location-cont">
            <div id="location-header" className="user-info-header">
              Location
            </div>
            {/* Edit profile float */}
            <div id="location" className="user-info-text">
              {props.userProfile.location}
            </div>
          </div>

          <div id="occupation-cont">
            <div id="occupation-header" className="user-info-header">
              Occupation
            </div>
            {/* Edit profile float */}
            <div id="occupation" className="user-info-text">
              {props.userProfile.occupation}
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
          {props.userProfile.friendList.length > 0 && (
            <div id="friend-icon-cont">
              {props.userProfile.friendList.map((friend) =>
                friend.isPublished ? (
                  <div className="friend-icon-box" key={friend._id}>
                    <Link className="link" to={`/user/${friend._id}`}>
                      <img
                        className="prof-pic-friendList"
                        alt={`profile-pic-user-${friend.firstname}-${friend.lastname}`}
                        src={`http://localhost:5000/uploads/${friend.photo.filename}`}
                      />
                    </Link>
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
        <div id="user-info-footer">
          'Fakebook', created by Justin Hazelton, 2021 <br /> No copyright
          infringement intended.
        </div>
      </div>
      {/* </div> */}
      <div id="user-post-cont">
        <div id="new-post-card">
          <div id="new-post-card-top" className="new-post-card-row">
            <Link className="link" to={`/user/${props.userProfile._id}`}>
              <img
                className="prof-pic"
                alt={`profile-pic-user-${props.userProfile.firstname}-${props.userProfile.lastname}`}
                src={`http://localhost:5000/uploads/${props.userProfile.photo.filename}`}
              />
            </Link>
            <div
              id="woym-btn"
              onClick={() => {
                props.setCreatePostModalOpen(true);
              }}
            >
              What's on your mind, {props.userProfile.firstname}?
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

        <div className="no-posts-profile">
          <div className="no-posts-header-profile">No More Posts</div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default FriendPage;
