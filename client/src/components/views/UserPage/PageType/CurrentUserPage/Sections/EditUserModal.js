import React, { useRef } from "react";
import { useState, useEffect } from "react";
import Axios from "axios";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

import FileUploaderUser from "./FileUploaderUser";
import "./EditUserModal.css";

const filter = new badWords();
var path = require("path");

function EditUserModal(props) {
  const [bioText, setBioText] = useState(props.currentUser.bio);
  const [locationText, setLocationText] = useState(props.currentUser.location);
  const [occupationText, setOccupationText] = useState(
    props.currentUser.occupation
  );

  const [imgUpload, setImgUpload] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [addImageOpen, setAddImageOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return function cleanup() {
      props.setEditUserModalOpen(false);
    };
  }, []);

  const history = useHistory();

  //Not currently used
  function isEmpty(str) {
    return str.replace(/^\s+|\s+$/g, "").length == 0;
  }

  //Not currently used- for implementing image preview
  const handleChange = (e) => {
    setImgUpload(e.target.files[0]);
  };

  //Not currently used- for implementing image preview
  const handleCancel = () => {
    setImgUpload(null);
    setImgPreview("");
  };

  const submitEditUser = () => {
    if (filter.isProfane(bioText)) {
      alert("Bio contains a word that is not allowed.");
      return;
    }

    if (filter.isProfane(locationText)) {
      alert("Location contains a word that is not allowed.");
      return;
    }

    if (filter.isProfane(occupationText)) {
      alert("Occupation contains a word that is not allowed.");
      return;
    }

    if (bioText) {
      if (bioText.length > 140) {
        setErrorMessage("'Bio' is limited to 140 characters.");
        alert(
          `'Bio' is limited to 140 characters. Current character count: ${bioText.length}`
        );
        return;
      }
    }

    if (locationText) {
      if (locationText.length > 40) {
        setErrorMessage("'Location' is limited to 140 characters.");
        alert(
          `'Location' is limited to 40 characters. Current character count: ${locationText.length}`
        );
        return;
      }
    }

    if (occupationText) {
      if (occupationText.length > 40) {
        setErrorMessage("'Occupation' is limited to 140 characters.");
        alert(
          `'Occupation' is limited to to 40 characters. Current character count: ${occupationText.length}`
        );
        return;
      }
    }

    if (imgUpload) {
      let ext = path.extname(imgUpload.name);
      ext = ext.toLowerCase();
      if (
        ext !== ".png" &&
        ext !== ".jpg" &&
        ext !== ".gif" &&
        ext !== ".jpeg" &&
        ext !== ".svg" &&
        ext !== ".jpg"
      ) {
        setErrorMessage("Only image uploads are allowed");
        alert("Only image uploads are allowed");
        return;
      }
    }

    const formData = new FormData();
    formData.append("bio", bioText);
    formData.append("location", locationText);
    formData.append("occupation", occupationText);
    formData.append("file", imgUpload);

    Axios.put(`/user/`, formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res, err) => {
        setErrorMessage("");
        setBioText("");
        setLocationText("");
        setOccupationText("");
        props.setEditUserModalOpen(false);
        history.go(0);
      })
      .catch((error) => {
        alert("Failed to submit");
        console.log("error", error);
      });
  };

  return (
    <div className="edit-user-modal" onClick={() => {}}>
      <div
        className="edit-user-modal-content"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div id="edit-user-header">
          <div id="edit-user-header-top">
            <div id="edit-user-header-title">Edit Your Profile</div>
            <span
              className="close-edit-user"
              onClick={() => {
                props.setEditUserModalOpen(false);
              }}
            >
              &times;
            </span>
          </div>
        </div>
        <form id="edit-user-container">
          <div className="edit-bio-cont edit-cont">
            <div className="edit-bio-text edit-text">
              A little bit about yourself:
            </div>
            <input
              className="edit-bio-input edit-input"
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
            />
          </div>

          <div className="edit-location-cont edit-cont">
            <div className="edit-location-text edit-text">Location:</div>
            <input
              className="edit-location-input edit-input"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
            />
          </div>

          <div className="edit-occupation-cont edit-cont">
            <div className="edit-occupation-text edit-text">Occupation:</div>
            <input
              className="edit-occupation-input edit-input"
              value={occupationText}
              onChange={(e) => setOccupationText(e.target.value)}
            />
          </div>

          <div id="edit-user-mid-row">
            {imgPreview ? (
              <img
                id="scroll-img"
                src={`https://justins-fakebook-api.herokuapp.com/${imgPreview}`}
              />
            ) : (
              ""
            )}
          </div>
          <div id="edit-user-img-row">
            {addImageOpen ? (
              <div className="edit-user-image-upload">
                <FileUploaderUser
                  id="edit-user-form-img-upload"
                  onFileSelectSuccess={(file) => setImgUpload(file)}
                  onFileSelectError={({ error }) => alert(error)}
                  setImgUpload={setImgUpload}
                />
              </div>
            ) : (
              <div
                id="add-img-edit-btn"
                onClick={() => {
                  setAddImageOpen(true);
                }}
              >
                Update Profile Picture
              </div>
            )}
          </div>
          <div id="edit-user-bottom-row">
            <div
              id="submit-edit-user-full"
              className="submit-edit-user"
              onClick={() => {
                submitEditUser();
              }}
            >
              Save
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
