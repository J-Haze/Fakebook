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

// import scrollToComponent from "react-scroll-to-component";

function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [tokenRefresh, setTokenRefresh] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  // const [displayedPosts, setDisplayedPosts] = useState("");
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allFriends, setFriends] = useState([]);
  const [publishedPosts, setPublishedPosts] = useState([]);

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
  // const [notificationModalOpen, setNotificationModalOpen] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [refreshNotifications, setRefreshNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // const [refTarget, setRefTarget] = useState("");

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

  // useEffect(() => {
  //   let publishedPostsArr = [];
  //   if (allPosts) {
  //     if (allPosts.length > 0) {
  //       for (let i = 0; (i = allPosts.length - 1); i++) {
  //         if (allPosts[i].isPublished) {
  //           publishedPostsArr.push(allPosts[i]);
  //         }
  //       }
  //     }
  //   }
  //   setPublishedPosts(publishedPostsArr);
  // }, [allPosts]);

  // Move this stuff to other sections (you don't need if for the signup page)

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
      let reversedArray = allPostsArray.reverse();
      setAllPosts(allPostsArray.reverse());
      setDisplayedPosts(allPostsArray.reverse());
      // filterHomePosts()

      // setAllPosts(allPostsArray)
      // setDisplayedPosts(allPostsArray)
      setLoading(false);
    });
  };

  // const filterHomePosts = () => {

  // }

  useEffect(() => {
    if (isLoggedIn) {
      fetchPosts();
    }
  }, [isLoggedIn]);

  // const fetchUsers = () => {
  //   Axios.get("/user/users", {
  //     headers: {
  //       Authorization: `Bearer ${JSON.parse(
  //         window.localStorage.getItem("token")
  //       )}`,
  //     },
  //   }).then((res) => {
  //     setAllUsers(res.data);
  //   });
  // };

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const fetchUsers = () => {
    Axios.get("/user/users", {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    }).then((res) => {
      console.log("res.data", res.data);
      let allUsersArray = res.data;
      setAllUsers(allUsersArray);
      setAllUsers(res.data);
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers();
      console.log("All Users:", allUsers);
    }
  }, [isLoggedIn]);

  //^^^

  const sendRequest = (receiver) => {
    console.log("Sent Request");
    console.log("Sender", currentUser._id);
    console.log("Receiver", receiver._id);

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
        console.log("Request sent");
        console.log(res);
        //Send notification
      })
      .catch((error) => {
        alert("Failed to send request");
        console.log("error", error);
      });
  };

  const cancelRequest = (requestid) => {
    console.log("Cancel Request");

    Axios.delete(`/request/${requestid}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    })
      .then((res, err) => {
        setSendingRequst(!sendingRequest);
        console.log("Request cancelled");
        console.log(res);
        fetchUsers();
        fetchPendingRequests();
        //Remove notification?
      })
      .catch((error) => {
        alert("Failed to cancel request");
        console.log("error", error);
      });
  };

  const acceptRequest = (requestid, userid) => {
    // console.log("Accepted Request");
    Axios.post(
      `/request/${requestid}/accept`,
      {
        //  receiver: receiver._id,
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
        // setSendingRequst(!sendingRequest);
        //Something to re-render page (change state to "friend")
        // setUpdateUserPage(!updateUserPage);
        // history.push(`/user/${userid}`);
        console.log("Request accepted");
        console.log(res);
        fetchUsers();
        fetchIncomingRequests();
        sendNotification(userid, "acceptedRequest", "request", requestid);
        setRefreshUser(!refreshUser);
        //Send notification
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
        console.log("Request Declined");
        console.log(res);
        setUpdateUserPage(!updateUserPage);
        fetchIncomingRequests();
        //Remove notification?
      })
      .catch((error) => {
        alert("Failed to decline request");
        console.log("error", error);
      });
  };

  const submitUnfriend = (userid) => {
    console.log("unfriend");

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
        // setUpdateUserPage(!updateUserPage);
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
      console.log("res.data request", res.data);
      console.log("res.data.length request", res.data.length);
      // let allUsersArray = res.data;
      setReceivedRequests(res.data);

      if (res.data.length == 0 || res.data.length == undefined) {
        setReceivedRequestsCount("");
        console.log("zero");
        return;
      } else {
        setReceivedRequestsCount(res.data.length);
        console.log("res.data.length request2", res.data.length);
        console.log("made it here");
      }

      // setAllUsers(res.data);
    });
  };

  useEffect(() => {
    fetchIncomingRequests();
    console.log("tada", receivedRequests);
    console.log("tada2", receivedRequestsCount);
    // return (
    //   setReceivedRequests([])
    // )

    // Something to refresh requests after accepting/declining?
  }, [currentUser]);

  const fetchPendingRequests = () => {
    Axios.get("/request/sent", {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    }).then((res) => {
      console.log("res.data request", res.data);
      console.log("res.data.length request", res.data.length);
      // let allUsersArray = res.data;
      setSentRequests(res.data);

      if (res.data.length == 0 || res.data.length == undefined) {
        setSentRequestsCount("");
        console.log("zero");
        return;
      } else {
        setSentRequestsCount(res.data.length);
        console.log("res.data.length request2", res.data.length);
        console.log("made it here");
      }

      // setAllUsers(res.data);
    });
  };

  useEffect(() => {
    fetchPendingRequests();
    // console.log("tada", receivedRequests);
    // console.log("tada2", receivedRequestsCount);
    // return (
    //   setReceivedRequests([])
    // )

    // Something to refresh requests after accepting/declining?
  }, [currentUser]);

  const fetchNotifications = () => {
    console.log("Fetching notifications");
    Axios.get("/notification/received", {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    }).then((res) => {
      let notificationsVar = res.data;
      console.log("notifications:", notificationsVar);
      // let reversedArray = allPostsArray.reverse();
      setNotifications(notificationsVar.reverse());
      // setDisplayedPosts(allPostsArray.reverse());
      // filterHomePosts()

      // setAllPosts(allPostsArray)
      // setDisplayedPosts(allPostsArray)
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser, refreshNotifications]);

  const sendNotification = (receiverId, action, objectType, objectId) => {
    // if (currentUser._id === receiverId) {
    //   return
    // }

    // if (objectId == "sentRequest") {
    //   Axios.get
    // }

    let parentId = null;
    // let objectId = objectId;

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
        console.log("Notification Sent");
        fetchNotifications();
        // notificationCount?
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
          // event.stopPropagation();
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
          // handleNotificationClick={handleNotificationClick}
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
                    // refTarget={refTarget}
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

                    // sendRequest={sendRequest}
                    // cancelRequest={cancelRequest}
                    // acceptRequest={acceptRequest}
                    // declineRequest={declineRequest}
                    // submitUnfriend={submitUnfriend}
                    // sendingRequest={sendingRequest}
                    // receivedRequests={receivedRequests}
                    // setReceivedRequests={setReceivedRequests}
                    // receivedRequestsCount={receivedRequestsCount}
                    // setReceivedRequestsCount={setReceivedRequestsCount}
                    // sentRequests={sentRequests}
                    // setSentRequests={setSentRequests}
                    // sentRequestsCount={sentRequestsCount}
                    // setSentRequestsCount={setSentRequestsCount}
                    // sendNotification={sendNotification}
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
