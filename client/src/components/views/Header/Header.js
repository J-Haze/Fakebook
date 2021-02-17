import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";

import fLogo from "../../../assets/facebook-logo-header.png";
import magIcon from "../../../assets/mag.png";
import logoutLogo from "../../../assets/logout.png";
import bellLogo from "../../../assets/bell.png";
import eyeIcon from "../../../assets/eye.png";
import friendsLogo from "../../../assets/friend.png";

import ProfilePic from "../HelperComponents/ProfilePic.js";

import NotificationCard from "./Sections/NotificationCard";

function Header(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hideDots, setHideDots] = useState(false);

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

  // Search Logic:
  useEffect(() => {
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

  useEffect(() => {
    let notificationCountVar = 0;
    for (let i = 0; i < props.notifications.length; i++) {
      if (!props.notifications[i].seen) {
        notificationCountVar++;
      }
    }
    if (notificationCountVar > 99) {
      notificationCountVar = 99;
    }
    props.setNotificationCount(notificationCountVar);
  }, [props.notifications]);

  const toggleNotificationModal = () => {
    if (props.notificationModalOpen) {
      props.setNotificationModalOpen(false);
      props.fetchNotifications();
    } else {
      props.fetchNotifications();
      props.setNotificationModalOpen(true);
      props.setNotificationCount(0);

      Axios.put(
        `/notification/see`,
        {},
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              window.localStorage.getItem("token")
            )}`,
          },
        }
      )
        .then((res) => {})
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  const markAllRead = () => {
    Axios.put(
      `/notification/interact/all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
      }
    )
      .then((res) => {
        setHideDots(true);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleNotificationClick = (notification) => {
    if (notification.interacted == false) {
      Axios.put(
        `/notification/${notification._id}/interact`,
        {},
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              window.localStorage.getItem("token")
            )}`,
          },
        }
      )
        .then((res) => {
          props.fetchNotifications();
          
          if (notification.objectType == "post") {
            history.push(`/post/${notification.objectId}`);
          } else if (notification.objectType == "comment") {
            history.push(`/post/${notification.parentId}`);
          } else if (notification.objectType == "request") {
            history.push(`/user/${notification.sender._id}`);
          }
          props.setNotificationModalOpen(false);
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      toggleNotificationModal();
      if (notification.objectType == "post") {
        history.push(`/post/${notification.objectId}`);
      } else if (notification.objectType == "comment") {
        history.push(`/post/${notification.parentId}`);
      } else if (notification.objectType == "request") {
        history.push(`/user/${notification.sender._id}`);
      }
    }
  };

  return (
    <div id="header">
      <div id="header-container">
        <div id="header-left-menu">
          <Link id="fb-icon-cont" className="link-header" to={`/`}>
            <img className="fb-icon" src={fLogo} alt="fb logo" title="Home" />
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
              }}
            >
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
              <div id="search-modal-cont">
                {!searchResults ? (
                  ""
                ) : searchResults.length == 0 ? (
                  <div className="no-search-results"> No results found.</div>
                ) : (
                  searchResults.slice(0, 6).map((user) => (
                    <Link
                      key={user._id}
                      className="link search-card"
                      to={`/user/${user._id}`}
                      onClick={(event) => {
                        props.setSearchModalOpen(false);
                      }}
                    >
                      <img
                        className="prof-pic-search-card"
                        alt={`profile-pic-user-${user.firstname}-${user.lastname}`}
                        src={`https://justins-fakebook-api.herokuapp.com/uploads/${user.photo.filename}`}
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
            title="Create Post"
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
            title="Friends"
            to={`/friends/${props.currentUser._id}`}
          >
            <img
              className="friends-icon"
              src={friendsLogo}
              alt="friends icon"
            />
          </Link>
          <div
            id="bell-cont"
            className="link hover-gray"
            title="Notifications"
            onClick={(event) => {
              event.stopPropagation();
              toggleNotificationModal();
            }}
          >
            <img
              className="bell-icon"
              src={bellLogo}
              alt="notifications-icon"
            />

            {props.notificationCount == 0 ? (
              ""
            ) : (
              <div className="notification-count">
                {props.notificationCount}
              </div>
            )}

            {props.notificationModalOpen ? (
              <div id="notification-modal-cont">
                <div id="notification-modal-header-cont">
                  <div id="notification-modal-header">Notifications</div>
                  <img
                    id="notification-eye-icon"
                    src={eyeIcon}
                    alt="read-all-icon"
                    title="Mark all as read"
                    onClick={(event) => {
                      event.stopPropagation();
                      markAllRead();
                    }}
                  />
                </div>
                {!props.notifications ? (
                  <div className="no-notification-results">
                    {" "}
                    You have no notifications.
                  </div>
                ) : props.notifications.length == 0 ? (
                  <div className="no-notification-results">
                    {" "}
                    You have no notifications.
                  </div>
                ) : (
                  props.notifications.map((notification) => (
                    <NotificationCard
                      key={notification._id}
                      notification={notification}
                      handleNotificationClick={handleNotificationClick}
                      hideDots={hideDots}
                      setNotificationModalOpen={props.setNotificationModalOpen}
                    />
                  ))
                )}
              </div>
            ) : (
              ""
            )}
          </div>

          <div id="prof-header" className="prof-icon" onClick={() => {}}>
            <ProfilePic user={props.currentUser} />
          </div>

          <div
            id="logout-cont"
            className="hover-gray"
            onClick={() => {
              logOut();
            }}
          >
            <img
              className="logout-icon"
              src={logoutLogo}
              alt="logout icon"
              title="Log Out"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
