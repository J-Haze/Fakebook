import React, { useState, useEffect } from "react";
import Axios from "axios";
import "../LoginPage.css";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

function SignupModal(props) {
  const [firstname, setFirstName] = useState("");
  const [lasstname, setLastName] = useState("");
  const [email, setEmail] = useState("");
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

  const yearOptions = [];
  const currentYear = new Date().getFullYear();

  console.log("cy", currentYear);

  for (let i = currentYear - 1; i > 1910; i--) {
    yearOptions.push(i);
  }

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
        <form id="signup-container">
          <div id="name-row">
            <input
              id="firstname"
              className="input-signup"
              placeholder="First name"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              id="lastname"
              className="input-signup"
              placeholder="Last name"
              value={firstname}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            id="email"
            className="input-signup input-marg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password"
            className="input-signup input-marg"
            placeholder="New password"
            value={email}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="signup-label">Birthday</div>
          <div id="date-row">
            <select
              className="form-select"
              name="birthMonth"
              id="birthMonth"
              defaultValue="1"
            >
              <option value="1">Jan</option>
              <option value="2">Feb</option>
              <option value="3">Mar</option>
              <option value="4">Apr</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">Aug</option>
              <option value="9">Sep</option>
              <option value="10">Oct</option>
              <option value="11">Nov</option>
              <option value="12">Dec</option>
            </select>
            <select
              className="form-select"
              name="birthDay"
              id="birthDay"
              defaultValue="1"
            >
              <option key="1">1</option>
              {[...Array(32).keys()].splice(2).map((day) => (
                <option value={day} key={day}>
                  {day}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              name="birthYear"
              id="birthYear"
              defaultValue={currentYear}
            >
              <option value={currentYear} key={currentYear}>
                2021
              </option>
              {yearOptions.map((year) => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="signup-label">Gender</div>
          <div id="gender-row">
            <div className="radio-box">
              <label className="gender-radio">
                {/* &nbsp; */}
                Female
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  className="circle"
                  required
                />
              </label>
            </div>
            <div className="radio-box rb-mid">
              <label className="gender-radio">
                Male
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  className="circle"
                  required
                />
              </label>
            </div>
            <div className="radio-box">
              <label className="gender-radio">
                Other
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  className="circle"
                  required
                />
              </label>
            </div>
          </div>

          {/* Error Message Here */}
          <div className="error-message-signup">{errorMessage}</div>
          <div
            id="submit-signup"
            onClick={() => {
              //   props.setSignupModalOpen(false);
            }}
          >
            {" "}
            Sign Up
          </div>
        </form>

        {/* <div id="submit-btn-cont">
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
        </div> */}
      </div>
    </div>
  );
}

export default SignupModal;
