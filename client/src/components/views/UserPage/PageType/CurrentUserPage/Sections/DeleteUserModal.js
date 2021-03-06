import React, { useRef } from "react";
import { useState, useEffect } from "react";
import Axios from "axios";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

import "./DeleteUserModal.css";

function DeleteUserModal(props) {
  useEffect(() => {
    return function cleanup() {
      props.setDeleteUserModalOpen(false);
    };
  }, []);

  const history = useHistory();

  function logOut() {
    props.setIsLoggedIn(false);
    props.setCurrentUser("");
    localStorage.setItem("token", JSON.stringify("No token"));
    history.push("/");
  }

  function submitDeleteUser() {
    Axios.put(
      `/user/${props.currentUser._id}/unpublish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
      }
    )
      .then((res) => {
        props.setDeleteUserModalOpen(false);
        logOut();
      })
      .catch((error) => {
        console.log("error", error);
        alert("Cannot delete this user.");
      });
  }

  return (
    <div
      className="delete-user-modal"
      onClick={() => {
        props.setDeleteUserModalOpen(false);
      }}
    >
      <div
        className="delete-user-modal-content"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div id="delete-user-header">
          <span
            className="close-delete-user"
            onClick={() => {
              props.setDeleteUserModalOpen(false);
            }}
          >
            &times;
          </span>
          <div id="delete-user-header-top">
            <div id="delete-user-header-title">
              Are you sure you want to delete this account?
            </div>
            <div id="delete-user-header-subtitle">
              This action cannot be undone.
            </div>
          </div>
        </div>
        <div id="delete-user-container">
          <div id="delete-user-bottom-row">
            <div
              id="submit-delete-user-cancel"
              className="submit-delete-user-btn"
              onClick={() => {
                props.setDeleteUserModalOpen(false);
              }}
            >
              Cancel
            </div>
            <div
              id="submit-delete-user-confirm"
              className="submit-delete-user-btn"
              onClick={() => {
                submitDeleteUser();
              }}
            >
              Delete Account
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteUserModal;
