import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

import Card from "./Sections/Card.js";

import ProfilePic from "../HelperComponents/ProfilePic.js";
import { useHistory } from "react-router-dom";

function HomePage(props) {
  const [postCount, setPostCount] = useState(0);

  const history = useHistory();

  let postCountVar;
  useEffect(() => {
    let postCountVar = 0;
    if (props.displayedPosts.length > 0) {
      props.displayedPosts.forEach(function (post) {
        if (post.isPublished) {
          postCountVar++;
        }
      });
      setPostCount(postCountVar);
    }
  }, [props.displayedPosts]);

  return (
    <>
      {/* <div>Home Page</div> */}
      <div id="home">
        {/* {props.loading ? (
          <div>Loading... </div>
        ) : postCount === 0 ? (
          <div className="black-text no-blogs">
            No posts have been posted yet.
            {props.currentUser}
          </div>
        ) : ( */}
        <div id="home-blog-cont">
          <div id="new-post-card">
            <div id="new-post-card-top" className="new-post-card-row">
              {/* <Link className="link" to={`/user/${props.currentUser._id}`}>
                <img
                  className="prof-pic"
                  alt={`profile-pic-user-${props.currentUser.firstname}-${props.currentUser.lastname}`}
                  src={`http://localhost:5000/uploads/${props.currentUser.photo.filename}`}
                />
              </Link> */}
              <ProfilePic user={props.currentUser} />
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
          {props.displayedPosts.map((post) =>
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
          <div className="no-posts">
            <div className="no-posts-header">No More Posts</div>
            <div className="no-posts-subheader">
              Add more friends to see more posts in your News Feed
            </div>
            <div
              className="no-posts-btn"
              onClick={() => {
                history.push("/find-friends");
              }}
            >
              {" "}
              Find Friends
            </div>
          </div>
        </div>
        {/* )} */}
      </div>
    </>
  );
}

export default HomePage;
