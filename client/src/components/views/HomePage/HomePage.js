import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

import Card from "./Sections/Card.js";

import ProfilePic from "../HelperComponents/ProfilePic.js";
import UserCard from "../HelperComponents/UserCard.js";

import { useHistory } from "react-router-dom";

function HomePage(props) {
  const [homePosts, setHomePosts] = useState("");

  const history = useHistory();

  useEffect(() => {
    let homePostsVar = [];

    if (
      props.displayedPosts == undefined ||
      props.displayedPosts.length == 0 ||
      props.displayedPosts == null ||
      props.displayedPosts == ""
    ) {
      homePostsVar = "";
      setHomePosts(homePostsVar);
      return;
    }

    if (
      props.currentUser.friendList == undefined ||
      props.currentUser.friendList.length == 0 ||
      props.currentUser.friendList == null ||
      props.currentUser.friendList == ""
    ) {
      // Only display your posts
      for (let i = props.displayedPosts.length - 1; i >= 0; i--) {
        if (props.displayedPosts[i].author._id == props.currentUser._id) {
          homePostsVar.push(props.displayedPosts[i]);
        }
      }
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
      } else {
        for (let j = props.currentUser.friendList.length - 1; j >= 0; j--) {
          if (
            props.displayedPosts[i].author._id ==
            props.currentUser.friendList[j]._id
          ) {
            homePostsVar.push(props.displayedPosts[i]);
          }
        }
      }

      let sortedHomePostsVar = homePostsVar;

      sortedHomePostsVar.sort(function (a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      setHomePosts(sortedHomePostsVar.reverse());
    }
  }, [
    props.displayedPosts,
    props.currentUser.friendList,
    props.currentUser,
    props.allUsers,
      props.allPosts,
    props.displayedPosts
  ]);

  useEffect(() => {

    return function cleanup() {
      props.fetchUsers();
      props.fetchPosts();
    };
  }, []);

  return (
    <>
      <div id="home-cont">
        <div id="home-current-user-cont">
          <UserCard user={props.currentUser} />
        </div>
        <div id="home">
          <div id="home-blog-cont">
            <div id="new-post-card">
              <div id="new-post-card-top" className="new-post-card-row">
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
            </div>
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
        </div>
        <div id="home-friend-cont">
          <div id="home-current-user-friend-list-side">
            <div
              id="current-user-fl-side-requests-cont"
              className="current-user-fl-side-cont"
            >
              {props.receivedRequestsCount == 1 ? (
                <div id="current-user-fl-side-subheader">
                  &nbsp;&nbsp;1 Friend Request
                </div>
              ) : (
                <div id="current-user-fl-side-subheader">
                  &nbsp;&nbsp;{props.receivedRequestsCount} Friend Requests
                </div>
              )}

              {props.receivedRequests == "" ? (
                <div className="no-new-requests">No new requests</div>
              ) : (
                props.receivedRequests.map((request) =>
                  request.sender.isPublished ? (
                    <div className="home-friend-request-card" key={request._id}>
                      <Link className="link" to={`/user/${request.sender._id}`}>
                        <img
                          className="prof-pic-friendList-request-page"
                          alt={`profile-pic-user-${request.sender.firstname}-${request.sender.lastname}`}
                          src={`http://localhost:5000/uploads/${request.sender.photo.filename}`}
                        />
                      </Link>
                      <div className="friend-request-card-info">
                        <div
                          className="friend-request-card-username"
                          onClick={() => {
                            history.push(`/user/${request.sender._id}`);
                          }}
                        >
                          {request.sender.firstname} {request.sender.lastname}
                        </div>
                        <div className="friend-request-card-btn-cont">
                          <div
                            className="friend-request-card-btn-confirm"
                            onClick={() => {
                              props.acceptRequest(
                                request._id,
                                request.sender._id
                              );
                            }}
                          >
                            Confirm
                          </div>
                          <div
                            className="friend-request-card-btn-decline"
                            onClick={() => {
                              props.declineRequest(request._id);
                            }}
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                )
              )}
            </div>
            <div
              id="current-user-fl-side-pending-cont"
              className="current-user-fl-side-cont"
            >
              {props.sentRequestsCount == 1 ? (
                <div id="current-user-fl-side-subheader-pending">
                  &nbsp;&nbsp;1 Request Pending
                </div>
              ) : (
                <div id="current-user-fl-side-subheader-pending">
                  &nbsp;&nbsp;{props.sentRequestsCount} Requests Pending
                </div>
              )}
              {props.sentRequestsCount == "" ? (
                <div className="no-new-requests">No pending requests</div>
              ) : (
                props.sentRequests.map((request) =>
                  request.receiver.isPublished ? (
                    <div className="home-friend-request-card" key={request._id}>
                      <Link
                        className="link"
                        to={`/user/${request.receiver._id}`}
                      >
                        <img
                          className="prof-pic-friendList-request-page"
                          alt={`profile-pic-user-${request.receiver.firstname}-${request.receiver.lastname}`}
                          src={`http://localhost:5000/uploads/${request.receiver.photo.filename}`}
                        />
                      </Link>
                      <div className="friend-request-card-info">
                        <div
                          className="friend-request-card-username"
                          onClick={() => {
                            history.push(`/user/${request.receiver._id}`);
                          }}
                        >
                          {request.receiver.firstname}{" "}
                          {request.receiver.lastname}
                        </div>
                        <div className="friend-request-card-btn-cont">
                          <div className="friend-request-card-btn-pending">
                            Request Pending
                          </div>
                          <div
                            className="friend-request-card-btn-cancel"
                            onClick={() => {
                              props.cancelRequest(request._id);
                            }}
                          >
                            Cancel
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                )
              )}
              <div className="top-border-gray"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
