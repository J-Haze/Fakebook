import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";

// import Card from "../HomePage/Sections/Card.js";
import { Link } from "react-router-dom";

import "./FindFriendsPage.css";

// import "./FriendListPage.css";

import FindFriendsCard from "./Sections/FindFriendsCard.s"

import { useHistory } from "react-router-dom";



function FindFriendsPage(props) {
  const history = useHistory();


  return (
    <div id="friend-list-page-cont">
      <div id="friend-list-page">
        <div className="friend-list-cont">
          {/* Something for if there's no friends */}
          <div className="friend-list-header">
            Find friends:
          </div>
          <div className="friend-list-card-cont">
            {props.allUsers == 0 && (
              <div className="no-friends-to-show">
                No Other Users
                {/* <FindFriendsBtn />  */}
              </div>
            )}
            {props.allUsers.map((user) =>
              user.isPublished ? (
                <div className="friend-card" key={user._id}>
                  <Link className="link" to={`/user/${user._id}`}>
                    <img
                      className="prof-pic-friendList-page"
                      alt={`profile-pic-user-${user.firstname}-${user.lastname}`}
                      src={`http://localhost:5000/uploads/${user.photo.filename}`}
                    />
                  </Link>
                  <div className="friend-card-info">
                    <div
                      className="friend-card-username"
                      onClick={() => {
                        history.push(`/user/${user._id}`);
                      }}
                    >
                      {user.firstname} {user.lastname}
                    </div>
                    <div className="friend-card-location">
                      {user.location}
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindFriendsPage;
