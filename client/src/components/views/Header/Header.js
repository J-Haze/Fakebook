import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useHistory } from "react-router-dom";

import fLogo from "../../../assets/facebook-logo-header.png";
import logoutLogo from "../../../assets/logout.png";
import friendsLogo from "../../../assets/friend.png";

function Header(props) {

  return (
    <div id="header">
      <div id="header-container">
        {/* <div id="title">Title</div> */}
        <div id="header-left-menu">
          <Link
            id="fb-icon-cont"
            className="link-header header-btn"
            to={`/user/${props.currentUser._id}`}
          >
            <img className="fb-icon" src={fLogo} alt="fb logo" />
          </Link>
        </div>
        <div id="header-right-menu">
          {" "}
          <Link
            id="logout-cont"
            className="link header-btn"
            to={`/user/${props.currentUser._id}`}
          >
            <img className="logout-icon" src={logoutLogo} alt="logout icon" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
