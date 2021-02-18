import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import "./CreatePostModal.css";
import badWords from "bad-words";

import FileUploader from "./Sections/FileUploader";
import ProfilePic from "../HelperComponents/ProfilePic";

var path = require("path");

const filter = new badWords();

function CreatePostModal(props) {
  const [text, setText] = useState("");
  const [imgUpload, setImgUpload] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [addImageOpen, setAddImageOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return function cleanup() {
      props.setCreatePostModalOpen(false);
    };
  }, []);

  function isEmpty(str) {
    return str.replace(/^\s+|\s+$/g, "").length == 0;
  }

  const submitCreatePost = () => {
    if (filter.isProfane(text)) {
      alert("Text contains a word that is not allowed.");
      return;
    }

    if (!text && !imgUpload) {
      setErrorMessage("Post must not be blank");
      alert("Post must not be blank");
      return;
    }

    if (text) {
      if (isEmpty(text) && !imgUpload) {
        setErrorMessage("Post must not be blank");
        alert("Post must not be blank");
        return;
      }
    }

    if (text.length > 1000) {
      setErrorMessage("Post must less than 1000 characters");
      alert("Post must less than 1000 characters");
      return;
    }

    if (imgUpload) {
      let ext = path.extname(imgUpload.name);
      if (
        ext !== ".png" &&
        ext !== ".jpg" &&
        ext !== ".gif"
        // &&
        // ext !== ".jpeg"
        // &&
        // ext !== ".svg"
      ) {
        setErrorMessage("File must be .png .jpg. or .gif");
        alert("File must be .png .jpg. or .gif");
        return;
      }
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("file", imgUpload);

    Axios.post(`/post/new`, formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res, err) => {
        setErrorMessage("");
        props.fetchPosts();
        setText("");
        props.setCreatePostModalOpen(false);
      })
      .catch((error) => {
        alert("Failed to submit");
        console.log("error", error);
      });
  };

  return (
    <div
      className="create-post-modal"
      // onClick={() => {
      //   props.setCreatePostModalOpen(false);
      // }}
    >
      <div
        className="create-post-modal-content"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div id="create-post-header">
          <div id="create-post-header-top">
            <div id="create-post-header-title">Create Post</div>
            <span
              className="close-create-post"
              onClick={() => {
                props.setCreatePostModalOpen(false);
              }}
            >
              &times;
            </span>
          </div>
        </div>
        <form id="create-post-container">
          <div id="create-post-mid-row">
            <div className="card-row-one">
              <div className="link" to={`/user/${props.currentUser._id}`}>
                <ProfilePic user={props.currentUser} />
              </div>
              <div className="flex-down card-title">
                <div className="create-post-username">
                  {props.currentUser.firstname} {props.currentUser.lastname}
                </div>
              </div>
            </div>
            <textarea
              id="woym-input"
              type="textarea"
              className="input-create-post"
              placeholder={`What's on your mind, ${props.currentUser.firstname}?`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {/* Not used */}
            {imgPreview ? (
              <img
                id="scroll-img"
                src={`https://justins-fakebook-api.herokuapp.com/uploads/${imgPreview}`}
              />
            ) : (
              ""
            )}
          </div>
          <div id="create-post-img-row">
            {addImageOpen ? (
              <div className="create-post-image-upload">
                <FileUploader
                  id="create-post-form-img-upload"
                  onFileSelectSuccess={(file) => setImgUpload(file)}
                  onFileSelectError={({ error }) => alert(error)}
                  setImgUpload={setImgUpload}
                />
              </div>
            ) : (
              <div
                id="add-img-btn"
                onClick={() => {
                  setAddImageOpen(true);
                }}
              >
                Add Image to Your Post
              </div>
            )}
          </div>
          <div id="create-post-bottom-row">
            {text.length == 0 && !imgUpload ? (
              <div id="submit-create-post-empty" className="submit-create-post">
                Post
              </div>
            ) : (
              <div
                id="submit-create-post-full"
                className="submit-create-post"
                onClick={() => {
                  submitCreatePost();
                }}
              >
                Post
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
