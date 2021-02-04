import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";

import Card from "../../HomePage/Sections/Card.js";

import "../UserPage.css";

function CurrentUserPage(props) {
  const [userPosts, setUserPosts] = useState([]);

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

  return (
    <div id="current-user-page">
      {/* <div id="user-page-content-cont"> */}
      <div id="user-info-cont">
        <div className="prof-icon-big"></div>
        <div className="user-card-username">
          {props.currentUser.firstname} {props.currentUser.lastname}
        </div>
        <div id="user-info-box">
          <div id="bio-cont">
            <div id="bio-header">Bio</div>
            {/* Edit profile float */}
            <div id="bio">{/* location */}</div>
          </div>

          <div id="location-cont">
            <div id="location-header">Location</div>
            {/* Edit profile float */}
            <div id="location">{/* location */}</div>

            <div id="occupation-cont">
              <div id="occupation-header">Occupation</div>
              {/* Edit profile float */}
              <div id="occupation">{/* location */}</div>
            </div>
          </div>
        </div>
        <div id="user-friends-box"></div>
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
