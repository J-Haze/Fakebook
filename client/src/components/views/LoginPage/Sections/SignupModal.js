import React, { useState, useEffect } from "react";
import Axios from "axios";
import "../LoginPage.css";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

function SignupModal(props) {
    const [firstname, setFirstName] = useState("");
    const [lasstname, setLastName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [birthMonth, setBirthMonth] = useState(1);
    const [birthDay, setBirthDay] = useState(1);
    const [birthYear, setBirthYear] = useState(2021);
    const [gender, setGender] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    
      const history = useHistory();

      if (props.isLoggedIn) {
        history.push("/");
      }

      useEffect(() => {
        if (props.isLoggedIn) {
          history.push("/");
        }
      }, []);
    
    //   const submitSignUp = () => {
    //     if (filter.isProfane(username)) {
    //       alert("Username contains a word that is not allowed.");
    //       setUsername("");
    //       return;
    //     }

    //     if (username.length < 3 || username.length > 15) {
    //       setErrorMessage(
    //         "Please enter a Username between 2 and 15 characters."
    //       );
    //       return;
    //     }

    //     if (password.length < 3 || password.length > 15) {
    //       setErrorMessage(
    //         "Please enter a Password between 2 and 15 characters."
    //       );
    //       return;
    //     }

    //     if (password !== confirmPassword) {
    //       setErrorMessage("Passwords do not match");
    //       return;
    //     }

    //     Axios.post("/user/new", {
    //       username: username,
    //       password: password,
    //       confirmPassword: confirmPassword,
    //     })
    //       .then((res) => {
    //         if (res.data.message) {
    //           setErrorMessage(res.data.message);
    //         } else {
    //           setErrorMessage("");
    //           setUsername("");
    //           setPassword("");
    //           setConfirmPassword("");

    //           Axios.post("/user/log-in", {
    //             username: username,
    //             password: password,
    //           }).then((res) => {
    //             if (res.data.message) {
    //               setErrorMessage(res.data.message);
    //             } else {
    //               window.localStorage.setItem(
    //                 "token",
    //                 JSON.stringify(res.data.token)
    //               );
    //               props.setTokenRefresh(!props.tokenRefresh);
    //               props.setIsLoggedIn(true);
    //               props.fetchUsers();
    //               history.go(-1);
    //             }
    //           });
    //         }
    //       })
    //       .catch((error) => console.log("error", error));
    //   };

  return (
    <div className="signup-modal">
      <div
        className="signup-modal-content"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div id="signup-header">
                  <div id="signup-header-top">
                      <div id="signup-header-title">Sign Up</div>
            <span
              className="close"
              onClick={() => {
                props.setSignupModalOpen(false);
              }}
            >
              &times;
            </span>
                  </div>
                  <div id="signup-header-subtitle">It's quick and easy.</div>
        </div>

        <div id="action-message">
          Are you sure you want to delete this post?
        </div>
        <div id="action-sub-message">This action cannot be undone.</div>
        <div id="submit-btn-cont">
          <div
            id="submit-decline"
            className="confirmation-btn"
            onClick={() => {
              props.setSignupModalOpen(false);
            }}
          >
            Cancel
          </div>
          <div
            id="submit-confirmation"
            className="confirmation-btn"
            onClick={() => {
              //   props.deletePost(props.postid);
            }}
          >
            Delete
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupModal;
