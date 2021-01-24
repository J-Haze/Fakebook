import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import Header from "./views/Header/Header";

import HomePage from "./views/HomePage/HomePage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import NotFound from "./views/NotFound/NotFound.js";

function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [tokenRefresh, setTokenRefresh] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allFriends, setFriends] = useState([]);

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
    Axios.get("/post/",
            {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
      }
    ).then((res) => {
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

  const fetchUsers = () => {
    Axios.get("/user/users", {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    }
    ).then((res) => {
      setAllUsers(res.data);
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers();
    }
  }, [isLoggedIn]);

//^^^

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() =>
          !isLoggedIn ? (
            <LoginPage
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
              setTokenRefresh={setTokenRefresh}
              tokenRefresh={tokenRefresh}
            />
          ) : (
            <HomePage
              currentUser={currentUser}
              isLoggedIn={isLoggedIn}
              fetchPosts={fetchPosts}
              displayedPosts={displayedPosts}
              loading={loading}
            />
          )
        }
      ></Route>

      <Route exact path="/log-in" render={() => <LoginPage />}></Route>

      <Route render={() => <NotFound />} />
    </Switch>
  );
}

export default App;
