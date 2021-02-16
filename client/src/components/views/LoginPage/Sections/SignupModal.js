import React, { useState, useEffect } from "react";
import Axios from "axios";
import "../LoginPage.css";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

const filter = new badWords();

function SignupModal(props) {
  const currentYear = new Date().getFullYear();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [birthYear, setBirthYear] = useState(currentYear);
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

  const submitSignUp = () => {
    if (filter.isProfane(firstname)) {
      alert("Firstname contains a word that is not allowed.");
      setFirstname("");
      return;
    }

    if (filter.isProfane(lastname)) {
      alert("Lastname contains a word that is not allowed.");
      setFirstname("");
      return;
    }

    if (firstname.length < 2 || firstname.length > 15) {
      setErrorMessage("Please enter a first name between 2 and 15 characters.");
      return;
    }

    if (lastname.length < 2 || lastname.length > 15) {
      setErrorMessage("Please enter a last name between 2 and 15 characters.");
      return;
    }

    if (
      !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8 || password.length > 15) {
      setErrorMessage("Please enter a Password between 8 and 15 characters.");
      return;
    }

    let birthDate = `${birthMonth}-${birthDay}-${birthYear}`;
    console.log("birthDate:", birthDate);

    if (
      (birthMonth === 2 && birthDay > 29) ||
      (birthMonth === 4 && birthDay === 31) ||
      (birthMonth === 6 && birthDay === 31) ||
      (birthMonth === 9 && birthDay === 31) ||
      (birthMonth === 11 && birthDay === 31)
    ) {
      setErrorMessage("Please enter a valid date of birth");
      return;
    }

    if (gender === "") {
      setErrorMessage("Please select a gender");
      return;
    }

    Axios.post("/user/new", {
      firstname: firstname,
      lastname: lastname,
      email: email.toLowerCase(),
      password: password,
      birthDate: birthDate,
      gender: gender,
    })
      .then((res) => {
        if (res.data.message) {
          console.log("Error: request");
          setErrorMessage(res.data.message);
        } else {
          setErrorMessage("");
          setFirstname("");
          setLastname("");
          setPassword("");
          setBirthMonth(1);
          setBirthDay(1);
          setBirthYear(currentYear);
          setGender("");
          setPassword("");
          props.setCurrentUser(res.data);

          //Should I use a log in???
          Axios.post("/user/log-in", {
            email: email.toLowerCase(),
            password: password,
          }).then((res) => {
            if (res.data.message) {
              setErrorMessage(res.data.message);
            } else {
              window.localStorage.setItem(
                "token",
                JSON.stringify(res.data.token)
              );
              props.setTokenRefresh(!props.tokenRefresh);
              props.setSignupModalOpen(false);
              props.setIsLoggedIn(true);
              history.push(`/`);
              //   props.fetchUsers();
              //   history.go(-1);
            }
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  const yearOptions = [];

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
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              id="lastname"
              className="input-signup"
              placeholder="Last name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="signup-label">Birthday</div>
          <div id="date-row">
            <select
              className="form-select"
              name="birthMonth"
              id="birthMonth"
              defaultValue={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
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
              defaultValue={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
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
              defaultValue={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            >
              <option value={currentYear} key={currentYear}>
                {currentYear}
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
                Female
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  className="circle"
                  onChange={(e) => setGender(e.target.value)}
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
                  onChange={(e) => setGender(e.target.value)}
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
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
              </label>
            </div>
          </div>
          <div className="error-message-signup">{errorMessage}</div>
          <div
            id="submit-signup"
            onClick={() => {
              submitSignUp();
            }}
          >
            Sign Up
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupModal;
