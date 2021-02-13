import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import Header from "./views/Header/Header";

import HomePage from "./views/HomePage/HomePage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import UserPage from "./views/UserPage/UserPage.js";
import NotFound from "./views/NotFound/NotFound.js";
import CreatePostModal from "./views/CreatePostModal/CreatePostModal.js";
import FriendListPage from "./views/FriendListPage/FriendListPage";
import FindFriendsPage from "./views/FindFriendsPage/FindFriendsPage";

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

  const [sendingRequest, setSendingRequst] = useState(false);
  const [updateUserPage, setUpdateUserPage] = useState(false);
  const [refreshUser, setRefreshUser] = useState(false);

  const [pageType, setPageType] = useState("NonFriendPage");

  const [sentRequests, setSentRequests] = useState("");
  const [receivedRequests, setReceivedRequests] = useState("");

  const [sentRequestsCount, setSentRequestsCount] = useState("");
  const [receivedRequestsCount, setReceivedRequestsCount] = useState("");

  // const [createPostModalOpen, setCreatePostModalOpen] = useState(true);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);

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
      setLoading(false);
    });
  };

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

  const sendRequest = (reciever) => {
    console.log("Sent Request");
    console.log("Sender", currentUser._id);
    console.log("Reciever", reciever._id);

    Axios.post(
      `/request/`,
      {
        reciever: reciever._id,
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
        //  reciever: reciever._id,
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
        setRefreshUser(!refreshUser)
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
        console.log("zero")
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
    console.log("tada", receivedRequests)
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

  if (!isLoggedIn) {
    return (
      <LoginPage
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setCurrentUser={setCurrentUser}
        setTokenRefresh={setTokenRefresh}
        tokenRefresh={tokenRefresh}
      />
    );
  } else {
    return (
      <div>
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setCurrentUser={setCurrentUser}
          currentUser={currentUser}
          setCreatePostModalOpen={setCreatePostModalOpen}
          // isViewingProfile={isViewingProfile}
          // setIsViewingProfile={setIsViewingProfile}
        />
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

                  // setIsViewingProfile={setIsViewingProfile}
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

                  // fetchPosts={fetchPosts}
                  // displayedPosts={displayedPosts}
                  // createPostModalOpen={createPostModalOpen}
                  // setCreatePostModalOpen={setCreatePostModalOpen}
                />
              )}
            ></Route>
          ))}

          <Route
            exact
            path="/find-friends"
            render={() => (
              <FindFriendsPage
                
              />
            )}
          ></Route>

          <Route render={() => <NotFound />} />
        </Switch>
      </div>
    );
  }
}

export default App;
