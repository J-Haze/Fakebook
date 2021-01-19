import React from "react";
import { useState } from "react";
import Axios from "axios";
import "./LoginPage.css";
import { useHistory } from "react-router-dom";

function LoginPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  return (
    <div className="login-cont">
      <div id="cont-1">
          <div id="fb-signin-logo">fakebook</div>
          <div id="fb-signin-text">
            Connect with friends and the world around you on Facebook.
          </div>
        </div>
        <div
          className="login-content"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div id="title-login"> Log In: </div>
          <input
            id="username"
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            id="password"
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="error-message-login">{errorMessage}</div>
          <div id="submit-login" onClick={() => {}}>
            Log In
          </div>
        </div>
    </div>
  );
}

export default LoginPage;
