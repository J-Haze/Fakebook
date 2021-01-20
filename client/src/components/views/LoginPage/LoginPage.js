import React from "react";
import { useState } from "react";
import Axios from "axios";
import "./LoginPage.css";
import { useHistory } from "react-router-dom";

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  // if (props.isLoggedIn) {
  //   history.push("/");
  // }

  const submitLogin = () => {
    Axios.post("/user/log-in", {
      email: email,
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
          // history.go(-1);
          props.setIsLoggedIn(true);
        }
      })
      .catch((error) => console.log("error", error));
  };

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
