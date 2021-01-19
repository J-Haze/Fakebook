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
      <div className="login-text-cont">
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
        <input
          id="username"
          className="input-login"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          id="password"
          className="input-login"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="error-message-login">{errorMessage}</div>
        <div id="submit-login" className="login-btn" onClick={() => {}}>
          Log In
        </div>
        <div id="submit-fb-login" className="login-btn" onClick={() => {}}>
          Log In with Facebook
        </div>
        <div id="submit-guest-login" className="login-btn" onClick={() => {}}>
          Test Drive a Guest Account
        </div>
        <div
          id="submit-new-account-login"
          className="login-btn"
          onClick={() => {}}
        >
          Create New Account
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
