import React, { useRef } from "react";
import { useState, useEffect } from "react";
import Axios from "axios";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

import FileUploaderUser from "./FileUploaderUser";
import "./EditUserModal.css";

// import Editor from "../../HelperComponents/Editor";

// import ImageUpload from "./Sections/ImageUpload.js"

const filter = new badWords();
var path = require("path");

function EditUserModal(props) {
  //   const [title, setTitle] = useState(props.initialTitle);
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

  //   const submitCreatePost = () => {
  //     console.log("submitted");
  //   };

  function isEmpty(str) {
    return str.replace(/^\s+|\s+$/g, "").length == 0;
  }

  const handleChange = (e) => {
    // console.log("e.target:", e.target);
    // setImgUpload(e.target.value);
    setImgUpload(e.target.files[0]);

    //   setImgUpload(
    //   e.target.files
    // )

    //   console.log("e.target:", e.target);
    //   setImgUpload(e.target);
    //   setImgPreview(URL.createObjectURL(e.target.value));
  };

  //   const resetImgForm = () => {
  //     if (addImageOpen) {
  //       document.getElementById("edit-user-form-img-upload").reset();
  //     }
  //   };

  const handleCancel = () => {
    setImgUpload(null);
    setImgPreview("");
  };

  const submitEditUser = () => {
    // if (!text && !imgUpload) {
    //   setErrorMessage("Post must not be blank");
    //   alert("Post must not be blank");
    //   return;
    // }

    // if (text) {
    //   if (isEmpty(text) && !imgUpload) {
    //     setErrorMessage("Post must not be blank");
    //     alert("Post must not be blank");
    //     return;
    //   }
    // }

    if (bioText.length > 140) {
      setErrorMessage("'Bio' is limited to 140 characters.");
      alert(
        `'Bio' is limited to 140 characters. Current character count: ${bioText.length}`
      );
      return;
    }

    if (locationText.length > 40) {
      setErrorMessage("'Location' is limited to 140 characters.");
      alert(
        `'Location' is limited to 40 characters. Current character count: ${locationText.length}`
      );
      return;
    }

    if (occupationText.length > 40) {
      setErrorMessage("'Occupation' is limited to 140 characters.");
      alert(
        `'Occupation' is limited to to 40 characters. Current character count: ${occupationText.length}`
      );
      return;
    }

    // console.log("imgUpload", imgUpload)

    if (imgUpload) {
      let ext = path.extname(imgUpload.name);
      console.log("ext", ext);
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

    Axios.put(
      `/user/`,
      // {
      //   bio: bioText,
      //   location: locationText,
      //   occupation: occupationText,
      //   image: formData,
      // },
      formData,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((res, err) => {
        console.log("imgUpload2", imgUpload);
        setErrorMessage("");
        // if success then set image preview
        // props.fetchPosts();
        setBioText("");
        setLocationText("");
        setOccupationText("");
        //   props.whitePencil();
        // history.push(`/user/${props.currentUser._id}`);
        props.setEditUserModalOpen(false);
        history.go(0);
      })
      .catch((error) => {
        alert("Failed to submit");
        console.log("error", error);
      });
  };

  // let handleEditorChange = (content, editor) => {
  //   setMainText(content);
  // };

  // let goBack = () => {
  //   props.whitePencil();
  //   props.hideEditModal();
  // };

  //     const FileUploader = ({onFileSelect}) => {
  //     const fileInput = useRef(null)

  //     const handleFileInput = (e) => {
  //   // handle validations
  //   const file = e.target.files[0];
  //   if (file.size > 1024)
  //     onFileSelectError({ error: "File size cannot exceed more than 1MB" });
  //   else onFileSelectSuccess(file);
  // };

  //     return (
  //         <div className="file-uploader">
  //             <input type="file" onChange={handleFileInput}/>
  //             <button onClick={e => fileInput.current && fileInput.current.click()} className="btn btn-primary"></button>
  //         </div>
  //     )
  // }
  // console.log("bioText.length", bioText.length);
  console.log("imgUpload", imgUpload);
  // bioText.length == 0 && !{ imgUpload };

  return (
    <div
      className="edit-user-modal"
      onClick={() => {
        // props.setEditUserModalOpen(false);
      }}
    >
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
              // type="text"
              // className="input-edit-user"
              // placeholder={`bioText`}
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
            {/* <div className="card-row-one">
              <div className="prof-icon"></div>
              <div className="flex-down card-title">
                <div className="edit-user-username">
                  {props.currentUser.firstname} {props.currentUser.lastname}
                </div>
              </div>
            </div> */}
            {/* <input
                          id="woym-input"
                          type="textarea"
              className="input-edit-user"
              placeholder={`What's on your mind, ${props.currentUser.firstname}?`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            /> */}
            {/* <textarea
              id="woym-input"
              type="textarea"
              className="input-edit-user"
              placeholder={`What's on your mind, ${props.currentUser.firstname}?`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            /> */}
            {/* {imgPreview ? <img src={imgPreview} width="100%" /> : ""} */}
            {imgPreview ? (
              <img
                id="scroll-img"
                src={`http://localhost:5000/${imgPreview}`}
                // alt={`productImg-${index}`}
              />
            ) : (
              ""
            )}
            {/* <div className="error-message-edit-user">{errorMessage}</div> */}
          </div>
          <div id="edit-user-img-row">
            {addImageOpen ? (
              <div className="edit-user-image-upload">
                <FileUploaderUser
                  id="edit-user-form-img-upload"
                  onFileSelectSuccess={(file) => setImgUpload(file)}
                  onFileSelectError={({ error }) => alert(error)}
                  //   resetImgForm={resetImgForm}
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
            {/* {bioText.length == 0 && !imgUpload ? (
              <div id="submit-edit-user-empty" className="submit-edit-user">
                Save
              </div>
            ) : (
              <div
                id="submit-edit-user-full"
                className="submit-edit-user"
                onClick={() => {
                  submitCreatePost();
                }}
              >
                Save
              </div>
            )} */}

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
