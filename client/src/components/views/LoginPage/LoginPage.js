import React from "react";
import { useState } from "react";
import Axios from "axios";
import "./LoginPage.css";
import { useHistory } from "react-router-dom";

import SignupModal from "./Sections/SignupModal";

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  const history = useHistory();

  const submitLogin = () => {
    Axios.post("/user/log-in", {
      email: email.toLowerCase(),
      password: password,
    })
      .then((res) => {
        if (res.data.message) {
          setErrorMessage(res.data.message);
        } else {
          setErrorMessage("");
          setEmail("");
          setPassword("");
          window.localStorage.setItem("token", JSON.stringify(res.data.token));
          props.setTokenRefresh(!props.tokenRefresh);
          props.setIsLoggedIn(true);
          history.push(`/`);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const logInAsGuest = () => {
    Axios.post("/user/log-in/guest", {
    })
      .then((res) => {
        if (res.data.message) {
          setErrorMessage(res.data.message);
        } else {
          setErrorMessage("");
          setEmail("");
          setPassword("");
          window.localStorage.setItem("token", JSON.stringify(res.data.token));
          props.setTokenRefresh(!props.tokenRefresh);
          props.setIsLoggedIn(true);
          history.push(`/`);
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="login-cont">
      {signupModalOpen && (
        <SignupModal
          setSignupModalOpen={setSignupModalOpen}
          isLoggedIn={props.isLoggedIn}
          setIsLoggedIn={props.setIsLoggedIn}
          setCurrentUser={props.setCurrentUser}
          setTokenRefresh={props.setTokenRefresh}
          tokenRefresh={props.tokenRefresh}
        />
      )}
      <div className="login-text-cont">
        <div id="fb-signin-logo">fakebook</div>
        <div id="fb-signin-text">
          Connect with friends and the world around you on Fakebook.
        </div>
      </div>
      <div
        className="login-content"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <input
          id="email"
          className="input-login"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <div
          id="submit-login"
          className="login-btn"
          onClick={() => {
            submitLogin();
          }}
        >
          Log In
        </div>

        <div id="submit-guest-login" className="login-btn" onClick={() => {
          logInAsGuest();
        }}>
          Test Drive a Guest Account
        </div>
        <div
          id="submit-new-account-login"
          className="login-btn"
          onClick={() => {
            setSignupModalOpen(true);
          }}
        >
          Create New Account
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
