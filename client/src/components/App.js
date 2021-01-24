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
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [tokenRefresh, setTokenRefresh] = useState(true);

  const history = useHistory();

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
            <HomePage currentUser={currentUser} />
          )
        }
      ></Route>

      <Route exact path="/log-in" render={() => <LoginPage />}></Route>

      <Route render={() => <NotFound />} />
    </Switch>
  );
}

export default App;
