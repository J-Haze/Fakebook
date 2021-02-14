import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

import fLogo from "../../../assets/facebook-logo-header.png";
import magIcon from "../../../assets/mag.png";
import logoutLogo from "../../../assets/logout-alt.png";
import bellLogo from "../../../assets/bell.png";
import friendsLogo from "../../../assets/friend.png";

import ProfilePic from "../HelperComponents/ProfilePic.js";

function Header(props) {
  // const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const history = useHistory();

  function logOut() {
    props.setIsLoggedIn(false);
    props.setCurrentUser("");
    localStorage.setItem("token", JSON.stringify("No token"));
    history.push("/");
  }

  const fullname = (user) => {
    return user.firstname + " " + user.lastname;
  };

  // const sortQuery = (query) => {
  //   query.sort(function (a, b) {
  //   if (a.firstname < b.firstname) {
  //     return -1;
  //   }
  //   if (a.firstname > b.firstname) {
  //     return 1;
  //   }
  //   return 0;
  //       });
  // }

  // Search Logic:
  useEffect(() => {
    // search logic
    console.log("searchQuery", searchQuery);
    if (searchQuery == "") {
      props.setSearchModalOpen(false);
    }

    if (searchQuery.length) {
      if (searchQuery.length > 0) {
        props.setSearchModalOpen(true);
      } else {
        props.setSearchModalOpen(false);
      }

      let arr = props.allUsers;
      arr.sort(function (a, b) {
        if (a.firstname < b.firstname) {
          return -1;
        }
        if (a.firstname > b.firstname) {
          return 1;
        }
        return 0;
      });
      setSearchResults(
        arr.filter((user) =>
          fullname(user).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setSearchResults("");
    }
  }, [searchQuery]);

  return (
    <div id="header">
      <div id="header-container">
        {/* <div id="title">Title</div> */}
        <div id="header-left-menu">
          <Link id="fb-icon-cont" className="link-header" to={`/`}>
            <img className="fb-icon" src={fLogo} alt="fb logo" />
          </Link>
          <div
            id="search-cont"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div
              id="search-bar"
              onClick={(event) => {
                event.stopPropagation();

                // props.setSearchModalOpen(true);
              }}
            >
              {/* <div id="mag-icon"></div> */}
              <img id="mag-icon" src={magIcon} alt="magnifying-glass-icon" />
              <input
                id="search-bar-input"
                type="text"
                placeholder="Search Facebook"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {props.searchModalOpen ? (
              <div
                id="search-modal-cont"
                onClick={(event) => {
                  props.setSearchModalOpen(false);
                }}
              >
                {!searchResults ? (
                  ""
                ) : searchResults.length == 0 ? (
                  <div className="no-search-results"> No results found.</div>
                ) : (
                  searchResults.slice(0, 6).map((user) => (
                    <Link className="link search-card" to={`/user/${user._id}`}>
                      <img
                        className="prof-pic-search-card"
                        alt={`profile-pic-user-${user.firstname}-${user.lastname}`}
                        src={`http://localhost:5000/uploads/${user.photo.filename}`}
                      />
                      <div className="search-card-name">
                        {user.firstname} {user.lastname}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            ) : (
              ""
            )}
          </div>
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
