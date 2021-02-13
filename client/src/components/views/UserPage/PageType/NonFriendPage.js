import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Card from "../..//HomePage/Sections/Card.js";
// import EditUserModal from "../Current/Sections/EditUserModal.js";

function NonFriendPage(props) {
  const [userPosts, setUserPosts] = useState([]);

  const [friendCount, setFriendCount] = useState(0);

  //  const [editUserModalOpen, setEditUserModalOpen] = useState(true);
  const [unfriendModalOpen, setUnfriendModalOpen] = useState(false);

  const [haveIncomingRequest, setHaveIncomingRequest] = useState(false);
  const [haveSentRequest, setHaveSentRequest] = useState(false);

  const [requestID, setRequestID] = useState();

  const history = useHistory();

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

  function checkForRequest() {
    //Have it get any request with the reciever and sender and then determine if it's pending or received

    Axios.get(`/request/${props.currentUser._id}/${props.userProfile._id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    })
      .then((res) => {
        console.log("result", res.data);

        if (res.data == false) {
          setHaveSentRequest(false);
          setHaveIncomingRequest(false);
          return;
        }

        setRequestID(res.data._id);

        if (res.data.sender._id == props.currentUser._id) {
          // Sent Request Pending
          setHaveSentRequest(true);
        } else if (res.data.sender._id == props.userProfile._id) {
          //Have pending request
          setHaveIncomingRequest(true);
        } else {
          // Something went wrong
          console.log("Error with pending request");
        }
      })
      .catch((error) => console.log("error", error));
  }

  useEffect(() => {
    // check for requests
    checkForRequest();
  }, [props.sendingRequest]);

  // function acceptRequest() {
  //   console.log("Accepted Request");
  // }

  // function declineRequest() {
  //   console.log("Declined Request");
  // }

  // return <div id="non-friend-page">Non Friend Page</div>;
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
                  props.submitUnfriend();
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
            src={`http://localhost:5000/uploads/${props.userProfile.photo.filename}`}
          />
        ) : (
          <div className="prof-icon-big"></div>
        )}

        <div className="user-card-username">
          {props.userProfile.firstname} {props.userProfile.lastname}
        </div>

        {haveIncomingRequest ? (
          <div className="user-info-pending-cont">
            <div
              className="user-info-confirm-pending"
              onClick={() => {
                // setUnfriendModalOpen(true);
                props.acceptRequest(requestID, props.userProfile._id);
              }}
            >
              Confirm Request
            </div>
            <div
              className="user-info-delete-pending"
              onClick={() => {
                // setUnfriendModalOpen(true);
                props.declineRequest(requestID);
              }}
            >
              Delete Request
            </div>
          </div>
        ) : haveSentRequest ? (
          <div className="user-info-sent-req-cont">
            <div className="user-info-sent-req-pending">
              {" "}
              Friend Request Pending
            </div>
            <div
              className="user-info-sent-req"
              onClick={() => {
                props.cancelRequest(requestID);
              }}
            >
              Cancel Request
            </div>
          </div>
        ) : (
          <div className="user-info-add-friend-manage-cont">
            <div
              className="user-info-add-friend"
              onClick={() => {
                props.sendRequest(props.userProfile);
              }}
            >
              + Add Friend
            </div>
          </div>
        )}

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
              onClick={(event) => {
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
    </div>
  );
}

export default NonFriendPage;
