import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";

import fLogo from "../../../assets/facebook-logo-header.png";
import magIcon from "../../../assets/mag.png";
import logoutLogo from "../../../assets/logout-alt.png";
import bellLogo from "../../../assets/bell.png";
import eyeIcon from "../../../assets/eye.png";
import friendsLogo from "../../../assets/friend.png";

import ProfilePic from "../HelperComponents/ProfilePic.js";

function Header(props) {
  // const [searchModalOpen, setSearchModalOpen] = useState(false);
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


  useEffect(() => {
   let notificationCountVar = 0;
   for (let i = 0; i < props.notifications.length; i++) {
     // console.log(i, notificationsVar[i])
     if (!props.notifications[i].seen) {
       notificationCountVar++;
     }
   }
   if (notificationCountVar > 99) {
     notificationCountVar = 99;
   }
   props.setNotificationCount(notificationCountVar);

  }, [props.notifications])

  const toggleNotificationModal = () => {
    if (props.notificationModalOpen) {
      props.setNotificationModalOpen(false);
    } else {
      props.setNotificationModalOpen(true);
      props.setNotificationCount(0);
      // function to set all notifications to seen

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
    console.log("mark all read");
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
        // props.fetchNotifications();
        // props.setRefreshNotifications(!props.refreshNotifications)
        setHideDots(true);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // const ref = React.createRef();

  const handleNotificationClick = (notification) => {
    console.log(`/${notification.objectType}/${notification.objectId}`);
    if (notification.objectType == "post") {
      history.push(`/post/${notification.objectId}`);
    } else if (notification.objectType == "comment") {
      history.push(`/post/${notification.parentId}`);
    } else if (notification.objectType == "request") {
      history.push(`/user/${notification.sender._id}`);
    }
  };

  return (
    <div id="header">
      <div id="header-container">
        {/* <div id="title">Title</div> */}
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

          {/* This should just be an onClick? */}
          <div
            id="bell-cont"
            className="link hover-gray"
            title="Notifications"
            // to={`/user/notifications`}
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
                    <div
                      key={notification._id}
                      className="link notification-card"
                      // to={`/${notification.objectType}/${notification.objectId}`}
                      // to={`/user/${props.currentUser._id}`}
                      onClick={(event) => {
                        props.setNotificationModalOpen(false);
                        handleNotificationClick(notification);
                        // Submit interacted with
                      }}
                    >
                      <img
                        className="prof-pic-notification-card"
                        alt={`profile-pic-user-${notification.sender.firstname}-${notification.sender.lastname}`}
                        src={`http://localhost:5000/uploads/${notification.sender.photo.filename}`}
                      />
                      {/* <div classname="notification-text"> */}
                      {/* <div className="notification-card-name">
                          {notification.sender.firstname}{" "}
                          {notification.sender.lastname}
                        </div> */}
                      {notification.action === "like" ? (
                        <div className="notification-action">
                          <strong className="strong-blk">
                            {notification.sender.firstname}{" "}
                            {notification.sender.lastname}
                          </strong>{" "}
                          liked your {notification.objectType}.
                        </div>
                      ) : notification.action === "comment" ? (
                        <div className="notification-action">
                          <strong className="strong-blk">
                            {notification.sender.firstname}{" "}
                            {notification.sender.lastname}
                          </strong>{" "}
                          commented on your post.
                        </div>
                      ) : notification.action === "sentRequest" ? (
                        <div className="notification-action">
                          <strong className="strong-blk">
                            {notification.sender.firstname}{" "}
                            {notification.sender.lastname}
                          </strong>{" "}
                          sent you a friend request.
                        </div>
                      ) : notification.action === "acceptedRequest" ? (
                        <div className="notification-action">
                          <strong className="strong-blk">
                            {notification.sender.firstname}{" "}
                            {notification.sender.lastname}
                          </strong>{" "}
                          accepted your friend request.
                        </div>
                      ) : (
                        ""
                      )}
                      {/* </div> */}
                      {notification.interacted || hideDots ? ("") : (
                        <div className="blue-dot"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              ""
            )}
          </div>

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
