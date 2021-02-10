import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useHistory } from "react-router-dom";

import fLogo from "../../../assets/facebook-logo-header.png";
import logoutLogo from "../../../assets/logout-alt.png";
import bellLogo from "../../../assets/bell.png";
import friendsLogo from "../../../assets/friend.png";

import ProfilePic from "../HelperComponents/ProfilePic.js"

function Header(props) {
  const history = useHistory();

  function logOut() {
    props.setIsLoggedIn(false);
    props.setCurrentUser("");
    localStorage.setItem("token", JSON.stringify("No token"));
    history.push("/");
  }

  return (
    <div id="header">
      <div id="header-container">
        {/* <div id="title">Title</div> */}
        <div id="header-left-menu">
          <Link id="fb-icon-cont" className="link-header" to={`/`}>
            <img className="fb-icon" src={fLogo} alt="fb logo" />
          </Link>
        </div>
        <div id="header-right-menu">
          <div
            id="add-post-header"
            onClick={() => {
              props.setCreatePostModalOpen(true);
            }}
          >
            {" "}
            +
          </div>
          <Link
            id="friends-cont"
            className="link hover-gray"
            to={`/friends/${props.currentUser._id}`}
          >
            <img
              className="friends-icon"
              src={friendsLogo}
              alt="friends icon"
            />
          </Link>

          {/* This should just be an onClick? */}
          <Link
            id="bell-cont"
            className="link hover-gray"
            to={`/user/notifications`}
          >
            <img
              className="bell-icon"
              src={bellLogo}
              alt="notifications icon"
            />
          </Link>

          <div id="prof-header" className="prof-icon" onClick={() => {}}>
            {/* {props.currentUser.photo ? 
            <Link className="link" to={`/user/${props.currentUser._id}`}>
              <img
                className="prof-pic"
                alt={`profile-pic-user-${props.currentUser.firstname}-${props.currentUser.lastname}`}
                // src={`http://localhost:5000/uploads/${props.currentUser.photo.filename}`}
              />
              </Link>
              :
              <
              } */}
            <ProfilePic user={props.currentUser} />
          </div>

          <div
            id="logout-cont"
            className="hover-gray"
            onClick={() => {
              logOut();
            }}
          >
            <img className="logout-icon" src={logoutLogo} alt="logout icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
