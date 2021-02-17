import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Card from "../..//HomePage/Sections/Card.js";

import "../UserPage.css";

function FriendPage(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [friendCount, setFriendCount] = useState(0);
  const [unfriendModalOpen, setUnfriendModalOpen] = useState(false);

  const history = useHistory();

  useEffect(() => {
    let userPostArray = [];

    for (let i = 0; i < props.displayedPosts.length; i++) {
      if (props.displayedPosts[i].author._id == props.userProfile._id) {
        if (userPostArray.length == 0 || userPostArray == undefined) {
          userPostArray = [props.displayedPosts[i]];
        } else {
          userPostArray.push(props.displayedPosts[i]);
        }
      }
    }
    setUserPosts(userPostArray.reverse());
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
  }, [props.userProfile.friendList.length]);

  return (
    <div id="current-user-page">
      {unfriendModalOpen && (
        <div
          className="unfriend-modal"
          onClick={() => {
            setUnfriendModalOpen(false);
          }}
        >
          <div
            className="unfriend-modal-content"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div id="unfriend-header">
              <div id="unfriend-header-top">
                <div id="unfriend-header-title">
                  Unfriend {props.userProfile.firstname}{" "}
                  {props.userProfile.lastname}
                </div>
                <span
                  className="close-unfriend"
                  onClick={() => {
                    setUnfriendModalOpen(false);
                  }}
                >
                  &times;
                </span>
              </div>
            </div>
            <div id="unfriend-mid-row">
              <div className="unfriend-mid-row-text">
                Are you sure to want to remove {props.userProfile.firstname}{" "}
                {props.userProfile.lastname} as your friend?
              </div>
            </div>
            <div id="unfriend-bottom-row">
              <div
                className="cancel-unfriend unfriend-btn"
                onClick={() => {
                  setUnfriendModalOpen(false);
                }}
              >
                Cancel
              </div>
              <div
                className="submit-unfriend unfriend-btn"
                onClick={() => {
                  props.submitUnfriend(props.userProfile._id);
                  setUnfriendModalOpen(false);
                }}
              >
                Confirm
              </div>
            </div>
          </div>
        </div>
      )}
      <div id="user-info-cont">
        {props.userProfile.photo ? (
          <img
            className="prof-pic-big"
            alt={`profile-pic-user-${props.userProfile.firstname}-${props.userProfile.lastname}`}
            src={`https://justins-fakebook-api.herokuapp.com/uploads/${props.userProfile.photo.filename}`}
          />
        ) : (
          <div className="prof-icon-big"></div>
        )}

        <div className="user-card-username">
          {props.userProfile.firstname} {props.userProfile.lastname}
        </div>

        <div className="user-info-friend-manage-cont">
          <div className="user-info-confirm-friend"> &#10003; Friends</div>
          <div
            className="user-info-unfriend"
            onClick={() => {
              setUnfriendModalOpen(true);
            }}
          >
            Unfriend
          </div>
        </div>

        <div id="user-info-box">
          <div id="bio-cont">
            <div className="flex">
              <div id="bio-header" className="user-info-header">
                Bio
              </div>
            </div>
            <div id="bio" className="user-info-text">
              {props.userProfile.bio}
            </div>
          </div>

          <div id="location-cont">
            <div id="location-header" className="user-info-header">
              Location
            </div>
            <div id="location" className="user-info-text">
              {props.userProfile.location}
            </div>
          </div>

          <div id="occupation-cont">
            <div id="occupation-header" className="user-info-header">
              Occupation
            </div>
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
              onClick={() => {
                history.push(`/friends/${props.userProfile._id}`);
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
              {props.userProfile.friendList.slice(0, 9).map((friend) =>
                friend.isPublished ? (
                  <div className="friend-icon-box" key={friend._id}>
                    <Link className="link" to={`/user/${friend._id}`}>
                      <img
                        className="prof-pic-friendList"
                        alt={`profile-pic-user-${friend.firstname}-${friend.lastname}`}
                        src={`https://justins-fakebook-api.herokuapp.com/uploads/${friend.photo.filename}`}
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
          'Fakebook', created by Justin Hazelton, 2021 <br /> No copyright
          infringement intended.
        </div>
      </div>
      <div id="user-post-cont">
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

export default FriendPage;
