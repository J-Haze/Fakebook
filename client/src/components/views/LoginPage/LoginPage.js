import React from "react";
import { useState } from "react";
import Axios from "axios";
import "./LoginPage.css";
import { useHistory } from "react-router-dom";

import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import SignupModal from "./Sections/SignupModal";

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

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

  const submitFBLogin = () => {
//Action is a get not a post, so I think something else is going on

    Axios.get("/user/auth/facebook")
      .then((res) => {
        console.log("here1")
        console.log('res', res)
        if (res.data.message) {
          setErrorMessage(res.data.message);
          console.log(res.data.message);
        } else {
          setErrorMessage("");
          setEmail("");
          setPassword("");
          console.log(res.data.token)
          window.localStorage.setItem("token", JSON.stringify(res.data.token));
          props.setTokenRefresh(!props.tokenRefresh);
          // history.go(-1);
          props.setIsLoggedIn(true);
        }
      })
      .catch((error) => console.log("error", error));
  }

  // const Facebook = ({ handleFBLogin }) => {
  // const componentClicked = () => {};

  //   const responseFacebook = (res) => {
  //   console.log("facebook res:", res)
  //     handleFBLogin(res.accessToken);
      
  //     Axios.get("/user/auth/facebook")
  //     .then((res) => {
  //       if (res.data.message) {
  //         setErrorMessage(res.data.message);
  //       } else {
  //         setErrorMessage("");
  //         setEmail("");
  //         setPassword("");
  //         window.localStorage.setItem("token", JSON.stringify(res.data.token));
  //         props.setTokenRefresh(!props.tokenRefresh);
  //         // history.go(-1);
  //         props.setIsLoggedIn(true);
  //       }
  //     })
  //     .catch((error) => console.log("error", error));
  // };

    
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
{/* 
        <FacebookLogin
          appId="566877284195455"
          autoLoad={true}
          fields="displayName, photos, email"
          onClick={componentClicked}
          callback={responseFacebook}
          render={(renderProps) => (
            <div
              id="submit-fb-login"
              className="login-btn"
              // onClick={() => {
              //   submitFBLogin();
              // }}
              onClick={renderProps.onClick}
            >
              Log In with Facebook
            </div>)}
        /> */}

        <div
          id="submit-fb-login"
          className="login-btn"
          onClick={() => {
            // submitFBLogin();
          }}
        >
          Log In with Facebook
        </div>

        {/* <a
          href={
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000/user/auth/facebook"
              : ""
          }
                    id="submit-fb-login"
          className="login-btn"
        >
          Log In with Facebook
        </a> */}
        <div id="submit-guest-login" className="login-btn" onClick={() => {}}>
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
