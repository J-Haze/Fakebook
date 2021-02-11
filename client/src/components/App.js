import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import Header from "./views/Header/Header";

import HomePage from "./views/HomePage/HomePage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import UserPage from "./views/UserPage/UserPage.js"
import NotFound from "./views/NotFound/NotFound.js";
import CreatePostModal from "./views/CreatePostModal/CreatePostModal.js";
import FriendListPage from "./views/FriendListPage/FriendListPage";

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
  }, [tokenRefresh]);

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
      console.log("res.data", res.data)
      let allUsersArray = res.data
      setAllUsers(allUsersArray);
      setAllUsers(res.data);
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers();
      console.log("All Users:", allUsers)
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
        setSendingRequst(!sendingRequest)
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

    Axios.delete(
      `/request/${requestid}`,
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
        console.log("Request cancelled");
        console.log(res);
        //Remove notification?
      })
      .catch((error) => {
        alert("Failed to cancel request");
        console.log("error", error);
      });
    
    }

  

  const acceptRequest = () => {
    console.log("Accepted Request");
  };


  const declineRequest = () => {
  console.log("Declined Request");
}

  const submitUnfriend = () => {
    console.log("unfriend");
  }


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

                  // fetchPosts={fetchPosts}
                  // displayedPosts={displayedPosts}
                  // createPostModalOpen={createPostModalOpen}
                  // setCreatePostModalOpen={setCreatePostModalOpen}
                />
              )}
            ></Route>
          ))}

          <Route render={() => <NotFound />} />
        </Switch>
      </div>
    );
  }
}

export default App;
