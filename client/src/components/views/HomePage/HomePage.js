import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

import Card from "./Sections/Card.js";

import ProfilePic from "../HelperComponents/ProfilePic.js";
import { useHistory } from "react-router-dom";

function HomePage(props) {
  const [homePosts, setHomePosts] = useState("");

  const history = useHistory();

  //Move to App.js

  useEffect(() => {
    let homePostsVar = [];
    // console.log("displayedPosts here", props.displayedPosts)

    if (
      props.displayedPosts == undefined ||
      props.displayedPosts.length == 0 ||
      props.displayedPosts == null ||
      props.displayedPosts == ""
    ) {
      console.log("no displayed Posts")
      homePostsVar = "";
      setHomePosts(homePostsVar);
      return
    }

    if (
      props.currentUser.friendList == undefined ||
      props.currentUser.friendList.length == 0 ||
      props.currentUser.friendList == null ||
      props.currentUser.friendList == ""
    ) {
      console.log("Only display My Posts");
        // Only display your posts
        for (let i = props.displayedPosts.length - 1; i >= 0; i--) {
          if (props.displayedPosts[i].author._id == props.currentUser._id) {
            homePostsVar.push(props.displayedPosts[i]);
            // console.log("new homePostsVar", homePostsVar);
          }
        }
      console.log("Only display My Posts", homePostsVar);
        let sortedHomePostsVar = homePostsVar;

        sortedHomePostsVar.sort(function (a, b) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });

        setHomePosts(sortedHomePostsVar.reverse());
        return;
      }
      
      for (let i = props.displayedPosts.length - 1; i >= 0; i--) {
        if (props.displayedPosts[i].author._id == props.currentUser._id) {
          homePostsVar.push(props.displayedPosts[i]);
          // console.log("new homePostsVar", homePostsVar);
        } else {
          for (let j = props.currentUser.friendList.length - 1; j >= 0; j--) {
            if (
              props.displayedPosts[i].author._id ==
              props.currentUser.friendList[j]._id
            ) {
              homePostsVar.push(props.displayedPosts[i]);
              // console.log("new homePostsVar", homePostsVar);
            }
          }
        }

        let sortedHomePostsVar = homePostsVar;

        sortedHomePostsVar.sort(function (a, b) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });

        setHomePosts(sortedHomePostsVar.reverse());

        // console.log("Splicing5", homePostsVar[i]);

        // nonFriendsArr.splice(i, 1);
      }
  }, [props.displayedPosts, props.currentUser.friendList, props.currentUser]);

  return (
    <>
      {/* <div>Home Page</div> */}
      <div id="home-cont">
        <div id="home-current-user-cont">x</div>
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

            {!homePosts
              ? ""
              : homePosts.map((post) =>
                  post.isPublished ? (
                    <Card
                      key={post._id}
                      post={post}
                      currentUser={props.currentUser}
                      fetchPosts={props.fetchPosts}
                      sendNotification={props.sendNotification}
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
        <div id="home-friend-cont">x</div>
      </div>
    </>
  );
}

export default HomePage;
