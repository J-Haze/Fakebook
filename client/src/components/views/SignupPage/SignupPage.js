import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import "./SignupPage.css";

import badWords from "bad-words";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const filter = new badWords();

function SignupPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  if (props.isLoggedIn) {
    history.push("/");
  }

  useEffect(() => {
    // if (props.isLoggedIn) {
    if (props.isLoggedIn) {
      history.push("/");
    }
  }, []);

  const submitSignUp = () => {
    console.log("Signed up")
  }

  return (
    <div className="signup-cont">
      <div
        className="signup-content"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div id="title-signup"> Sign Up: </div>
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
        <input
          id="confirmPassword"
          className="input"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="error-message-signup">{errorMessage}</div>
        <div
          id="submit-signup"
          onClick={() => {
            submitSignUp();
          }}
        >
          Sign Up
        </div>
        <div id="bottom">
          Already registered?{" "}
          <Link className="link-blue" to="/log-in">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
