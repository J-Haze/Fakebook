import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Card from "../../../HomePage/Sections/Card.js";
import EditUserModal from "./Sections/EditUserModal.js";
import DeleteUserModal from "./Sections/DeleteUserModal.js";

import "../../UserPage.css";

function CurrentUserPage(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [friendCount, setFriendCount] = useState(0);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);

  const history = useHistory();

  useEffect(() => {
    let ownPosts = [];
    for (let i = 0; i < props.displayedPosts.length; i++) {
      if (props.displayedPosts[i].author._id == props.currentUser._id) {
        if (ownPosts.length == 0 || ownPosts == undefined) {
          ownPosts = [props.displayedPosts[i]];
        } else {
          ownPosts.push(props.displayedPosts[i]);
        }
      }
    }
    setUserPosts(ownPosts.reverse());
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
          setEditUserModalOpen={setEditUserModalOpen}
          currentUser={props.currentUser}
        />
      )}

      {deleteUserModalOpen && (
        <DeleteUserModal
          setDeleteUserModalOpen={setDeleteUserModalOpen}
          currentUser={props.currentUser}
          setCurrentUser={props.setCurrentUser}
          isLoggedIn={props.isLoggedIn}
          setIsLoggedIn={props.setIsLoggedIn}
        />
      )}
      <div id="user-info-cont">
        {props.currentUser.photo ? (
          <img
            className="prof-pic-big"
            alt={`profile-pic-user-${props.currentUser.firstname}-${props.currentUser.lastname}`}
            src={`http://localhost:5000/uploads/${props.currentUser.photo.filename}`}
          />
        ) : (
          <div className="prof-icon-big"></div>
        )}

        <div className="user-card-username">
          {props.currentUser.firstname} {props.currentUser.lastname}
        </div>
        <div id="user-info-box">
          <div id="bio-cont">
            <div className="flex">
              <div id="bio-header" className="user-info-header">
                Bio
              </div>
              <span
                className="edit-user-prof"
                onClick={(event) => {
                  setEditUserModalOpen(true);
                }}
              >
                Edit Profile
              </span>
            </div>
            <div id="bio" className="user-info-text">
              {props.currentUser.bio}
            </div>
          </div>

          <div id="location-cont">
            <div id="location-header" className="user-info-header">
              Location
            </div>
            <div id="location" className="user-info-text">
              {props.currentUser.location}
            </div>
          </div>

          <div id="occupation-cont">
            <div id="occupation-header" className="user-info-header">
              Occupation
            </div>
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
              onClick={() => {
                history.push(`/friends/${props.currentUser._id}`);
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
              {props.currentUser.friendList.slice(0, 9).map((friend) =>
                friend.isPublished ? (
                  <div className="friend-icon-box" key={friend._id}>
                    <Link className="link" to={`/user/${friend._id}`}>
                      <img
                        className="prof-pic-friendList"
                        alt={`profile-pic-user-${friend.firstname}-${friend.lastname}`}
                        src={`http://localhost:5000/uploads/${friend.photo.filename}`}
                      />
                    </Link>
                    <div className="friend-icon-name">
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
          <div id="user-info-footer-text">
            'Fakebook', created by Justin Hazelton, 2021 <br /> No copyright
            infringement intended.
          </div>
          {props.currentUser.email == "guest@gmail.com" ? (
            ""
          ) : (
            <div
              id="delete-account-btn"
              onClick={() => {
                setDeleteUserModalOpen(true);
              }}
            >
              {" "}
              Delete Account
            </div>
          )}
        </div>
      </div>
      <div id="user-post-cont">
        <div id="new-post-card">
          <div id="new-post-card-top" className="new-post-card-row">
            <Link className="link" to={`/user/${props.currentUser._id}`}>
              <img
                className="prof-pic"
                alt={`profile-pic-user-${props.currentUser.firstname}-${props.currentUser.lastname}`}
                src={`http://localhost:5000/uploads/${props.currentUser.photo.filename}`}
              />
            </Link>
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
        {userPosts.map((post) =>
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
        <div className="no-posts-profile">
          <div className="no-posts-header-profile">No More Posts</div>
        </div>
      </div>
    </div>
  );
}

export default CurrentUserPage;
