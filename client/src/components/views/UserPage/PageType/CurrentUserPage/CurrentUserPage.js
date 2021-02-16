import React from "react";
import { useState, useEffect, useRef, forwardRef } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Card from "../../../HomePage/Sections/Card.js";
import EditUserModal from "./Sections/EditUserModal.js";

import "../../UserPage.css";

function CurrentUserPage(props) {
  const [userPosts, setUserPosts] = useState([]);

  const [friendCount, setFriendCount] = useState(0);

  //  const [editUserModalOpen, setEditUserModalOpen] = useState(true);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);

  // const [refs, setRefs] = useState([]);

  const history = useHistory();

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


//  useEffect(() => {
//    const refsVar = userPosts.reduce((acc, value) => {
//      acc[value._id] = React.createRef();
//      return acc;
//    }, {});

//    setRefs(refs)
//  }, [userPosts]);

  // const ref = React.createRef();

  // const refs = userPosts.reduce((acc, value) => {
  //   acc[value._id] = React.createRef();
  //   return acc;
  // }, {});

  // useEffect(() => {
  //   // If there is a notification command then scroll to the correct ref

  //   if (refs[props.refTarget]) {
  //     console.log("yes ref", props.refTarget);
  //     // props.ref.current.scrollIntoView({
  //     // document.getElementById(props.refTarget).current.scrollIntoView({
  //     //   behavior: "smooth",
  //     //   block: "start",
  //     // });
  //     refs[props.refTarget].current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "start",
  //     });
  //   }
  // }, [props.refTarget]);

  // const handleClick = (id) =>
  //   refs[id].current.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });

  // const refs = userPosts.reduce((acc, value) => {
  //   acc[value._id] = React.createRef();
  //   // acc[value._id] = useRef();
  //   return acc;
  // }, {});

  return (
    <div id="current-user-page">
      {editUserModalOpen && (
        <EditUserModal
          // createPostModalOpen={createPostModalOpen}
          setEditUserModalOpen={setEditUserModalOpen}
          currentUser={props.currentUser}
          // fetchPosts={fetchPosts}
        />
      )}
      {/* <div id="user-page-content-cont"> */}
      {/* <div className="test"> */}
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
          'Fakebook', created by Justin Hazelton, 2021 <br /> No copyright
          infringement intended.
        </div>
      </div>
      {/* </div> */}
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
              // ref={ref}
              // ref={useRef(`ref-post-${props.post._id}`)}
              // ref={refs[post._id]}
              // ref={refs[post._id]}
              // forwardRef={refs[post._id]}
              // id={`ref-post-${post._id}`}
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
      {/* </div> */}
    </div>
  );
}

export default CurrentUserPage;
