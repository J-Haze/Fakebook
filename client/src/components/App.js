import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import Header from "./views/Header/Header";

import HomePage from "./views/HomePage/HomePage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import UserPage from "./views/UserPage/UserPage.js";
import PostPage from "./views/PostPage/PostPage";
import NotFound from "./views/NotFound/NotFound.js";
import CreatePostModal from "./views/CreatePostModal/CreatePostModal.js";
import FriendListPage from "./views/FriendListPage/FriendListPage";
import FindFriendsPage from "./views/FindFriendsPage/FindFriendsPage";

function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenRefresh, setTokenRefresh] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [sendingRequest, setSendingRequst] = useState(false);
  const [updateUserPage, setUpdateUserPage] = useState(false);
  const [refreshUser, setRefreshUser] = useState(false);
  const [pageType, setPageType] = useState("NonFriendPage");
  const [sentRequests, setSentRequests] = useState("");
  const [receivedRequests, setReceivedRequests] = useState("");
  const [sentRequestsCount, setSentRequestsCount] = useState("");
  const [receivedRequestsCount, setReceivedRequestsCount] = useState("");
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [refreshNotifications, setRefreshNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const history = useHistory();

  //If there is a user logged in, it sets currentUser and isLoggedIn
  useEffect(() => {
    Axios.get("/user/", {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    })
      .then((res) => {
        setCurrentUser(res.data);
        setIsLoggedIn(true);
      })
      .catch((error) => console.log("error", error));
  }, [tokenRefresh, refreshUser]);

  const fetchPosts = () => {
    setLoading(true);
    Axios.get("/post/", {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    }).then((res) => {
      let allPostsArray = res.data;
      setAllPosts(allPostsArray.reverse());
      setDisplayedPosts(allPostsArray.reverse());
      setLoading(false);
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchPosts();
    }
  }, [isLoggedIn]);

  const fetchUsers = () => {
    Axios.get("/user/users", {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    }).then((res) => {
      let allUsersArray = res.data;
      setAllUsers(allUsersArray);
      setAllUsers(res.data);
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers();
    }
  }, [isLoggedIn]);

  const sendRequest = (receiver) => {
    Axios.post(
      `/request/`,
      {
        receiver: receiver._id,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
      }
    )
      .then((res, err) => {
        setSendingRequst(!sendingRequest);
        fetchUsers();
        fetchPendingRequests();
        sendNotification(receiver._id, "sentRequest", "request", null);
      })
      .catch((error) => {
        alert("Failed to send request");
        console.log("error", error);
      });
  };

  const cancelRequest = (requestid) => {
    Axios.delete(`/request/${requestid}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    })
      .then((res, err) => {
        setSendingRequst(!sendingRequest);
        fetchUsers();
        fetchPendingRequests();
      })
      .catch((error) => {
        alert("Failed to cancel request");
        console.log("error", error);
      });
  };

  const acceptRequest = (requestid, userid) => {
    Axios.post(
      `/request/${requestid}/accept`,
      {
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
      }
    )
      .then((res, err) => {
        setPageType("FriendPage");
        fetchUsers();
        fetchIncomingRequests();
        sendNotification(userid, "acceptedRequest", "request", requestid);
        setRefreshUser(!refreshUser);
      })
      .catch((error) => {
        alert("Failed to accept request");
        console.log("error", error);
      });
  };

  const declineRequest = (requestid) => {
    Axios.delete(`/request/${requestid}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    })
      .then((res, err) => {
        setSendingRequst(!sendingRequest);
        setUpdateUserPage(!updateUserPage);
        fetchIncomingRequests();
      })
      .catch((error) => {
        alert("Failed to decline request");
        console.log("error", error);
      });
  };

  const submitUnfriend = (userid) => {
    Axios.put(
      `/user/${userid}/unfriend`,
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
        setPageType("NonFriendPage");
        history.push(`/user/${userid}`);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const fetchIncomingRequests = () => {
    Axios.get("/request/received", {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    }).then((res) => {
      setReceivedRequests(res.data);

      if (res.data.length == 0 || res.data.length == undefined) {
        setReceivedRequestsCount("");
        return;
      } else {
        setReceivedRequestsCount(res.data.length);
      }
    });
  };

  useEffect(() => {
    fetchIncomingRequests();
  }, [currentUser]);

  const fetchPendingRequests = () => {
    Axios.get("/request/sent", {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    }).then((res) => {
      setSentRequests(res.data);

      if (res.data.length == 0 || res.data.length == undefined) {
        setSentRequestsCount("");
        return;
      } else {
        setSentRequestsCount(res.data.length);
      }
    });
  };

  useEffect(() => {
    fetchPendingRequests();
  }, [currentUser]);

  const fetchNotifications = () => {
    Axios.get("/notification/received", {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    }).then((res) => {
      let notificationsVar = res.data;
      setNotifications(notificationsVar.reverse());
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser, refreshNotifications]);

  const sendNotification = (receiverId, action, objectType, objectId) => {
    if (receiverId === currentUser._id) {
      return
    }

    let parentId = null;

    if (action == "comment" && objectType == "comment") {
      parentId = objectId;
      objectId = null;
    }

    Axios.post(
      `/notification/`,
      {
        sender: currentUser._id,
        receiver: receiverId,
        action: action,
        objectType: objectType,
        objectId: objectId,
        parentId: parentId,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
      }
    )
      .then((res, err) => {
        fetchNotifications();
      })
      .catch((error) => {
        alert("Failed to send notification");
        console.log("error", error);
      });
  };

  if (isLoggedIn) {
    return (
      <div
        id="main"
        onClick={(event) => {
          setSearchModalOpen(false);
          setNotificationModalOpen(false);
        }}
      >
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setCurrentUser={setCurrentUser}
          currentUser={currentUser}
          setCreatePostModalOpen={setCreatePostModalOpen}
          searchModalOpen={searchModalOpen}
          setSearchModalOpen={setSearchModalOpen}
          allUsers={allUsers}
          notifications={notifications}
          notificationModalOpen={notificationModalOpen}
          setNotificationModalOpen={setNotificationModalOpen}
          setRefreshNotifications={setRefreshNotifications}
          notificationCount={notificationCount}
          setNotificationCount={setNotificationCount}
          fetchNotifications={fetchNotifications}
        />
        <div id="content">
          {createPostModalOpen && (
            <CreatePostModal
              createPostModalOpen={createPostModalOpen}
              setCreatePostModalOpen={setCreatePostModalOpen}
              currentUser={currentUser}
              fetchPosts={fetchPosts}
            />
          )}
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <HomePage
                  currentUser={currentUser}
                  isLoggedIn={isLoggedIn}
                  fetchPosts={fetchPosts}
                  displayedPosts={displayedPosts}
                  loading={loading}
                  createPostModalOpen={createPostModalOpen}
                  setCreatePostModalOpen={setCreatePostModalOpen}
                  sendRequest={sendRequest}
                  cancelRequest={cancelRequest}
                  acceptRequest={acceptRequest}
                  declineRequest={declineRequest}
                  submitUnfriend={submitUnfriend}
                  sendingRequest={sendingRequest}
                  receivedRequests={receivedRequests}
                  setReceivedRequests={setReceivedRequests}
                  receivedRequestsCount={receivedRequestsCount}
                  setReceivedRequestsCount={setReceivedRequestsCount}
                  sentRequests={sentRequests}
                  setSentRequests={setSentRequests}
                  sentRequestsCount={sentRequestsCount}
                  setSentRequestsCount={setSentRequestsCount}
                  sendNotification={sendNotification}
                />
              )}
            ></Route>

            {allUsers.map((user) => (
              <Route
                exact
                key={user._id}
                path={`/user/${user._id}`}
                render={() => (
                  <UserPage
                    userProfile={user}
                    currentUser={currentUser}
                    fetchPosts={fetchPosts}
                    displayedPosts={displayedPosts}
                    createPostModalOpen={createPostModalOpen}
                    setCreatePostModalOpen={setCreatePostModalOpen}
                    sendRequest={sendRequest}
                    cancelRequest={cancelRequest}
                    acceptRequest={acceptRequest}
                    declineRequest={declineRequest}
                    submitUnfriend={submitUnfriend}
                    sendingRequest={sendingRequest}
                    updateUserPage={updateUserPage}
                    submitUnfriend={submitUnfriend}
                    pageType={pageType}
                    setPageType={setPageType}
                    sendNotification={sendNotification}
                  />
                )}
              ></Route>
            ))}

            {allUsers.map((user) => (
              <Route
                exact
                key={user._id}
                path={`/friends/${user._id}`}
                render={() => (
                  <FriendListPage
                    user={user}
                    currentUser={currentUser}
                    sendRequest={sendRequest}
                    cancelRequest={cancelRequest}
                    acceptRequest={acceptRequest}
                    declineRequest={declineRequest}
                    submitUnfriend={submitUnfriend}
                    sendingRequest={sendingRequest}
                    receivedRequests={receivedRequests}
                    setReceivedRequests={setReceivedRequests}
                    receivedRequestsCount={receivedRequestsCount}
                    setReceivedRequestsCount={setReceivedRequestsCount}
                    sentRequests={sentRequests}
                    setSentRequests={setSentRequests}
                    sentRequestsCount={sentRequestsCount}
                    setSentRequestsCount={setSentRequestsCount}
                    sendNotification={sendNotification}
                  />
                )}
              ></Route>
            ))}

            {allPosts.map((post) => (
              <Route
                exact
                key={post._id}
                path={`/post/${post._id}`}
                render={() => (
                  <PostPage
                    post={post}
                    currentUser={currentUser}
                    fetchPosts={fetchPosts}
                    sendNotification={sendNotification}
                  />
                )}
              ></Route>
            ))}

            <Route
              exact
              path="/find-friends"
              render={() => (
                <FindFriendsPage
                  allUsers={allUsers}
                  currentUser={currentUser}
                  sendRequest={sendRequest}
                  cancelRequest={cancelRequest}
                  acceptRequest={acceptRequest}
                  declineRequest={declineRequest}
                  submitUnfriend={submitUnfriend}
                  sendingRequest={sendingRequest}
                  receivedRequests={receivedRequests}
                  setReceivedRequests={setReceivedRequests}
                  receivedRequestsCount={receivedRequestsCount}
                  setReceivedRequestsCount={setReceivedRequestsCount}
                  sentRequests={sentRequests}
                  setSentRequests={setSentRequests}
                  sentRequestsCount={sentRequestsCount}
                  setSentRequestsCount={setSentRequestsCount}
                  sendNotification={sendNotification}
                />
              )}
            ></Route>

            <Route render={() => <NotFound />} />
          </Switch>
        </div>
      </div>
    );
  } else {
    return (
      <LoginPage
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setCurrentUser={setCurrentUser}
        setTokenRefresh={setTokenRefresh}
        tokenRefresh={tokenRefresh}
      />
    );
  }
}

export default App;
