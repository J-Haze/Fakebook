import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useHistory } from "react-router-dom";

import fLogo from "../../../assets/facebook-logo-header.png";
import logoutLogo from "../../../assets/logout-alt.png";
import bellLogo from "../../../assets/bell.png";
import friendsLogo from "../../../assets/friend.png";

function Header(props) {
  const history = useHistory();

  function logOut() {
    props.setIsLoggedIn(false);
    props.setCurrentUser("");
    localStorage.setItem("token", JSON.stringify("No token"));
    // history.go(0);
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
          <Link
            id="friends-cont"
            className="link hover-gray"
            to={`/user/friends`}
          >
            <img
              className="friends-icon"
              src={friendsLogo}
              alt="friends icon"
            />
          </Link>
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

          <div
            id="prof-header"
            className="prof-icon"
            onClick={() => {
              
            }}
          >
            {/* <img className="logout-icon" src={logoutLogo} alt="logout icon" /> */}
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
