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
  const [bioText, setBioText] = useState("");


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
  //       document.getElementById("create-post-form-img-upload").reset();
  //     }
  //   };

  const handleCancel = () => {
    setImgUpload(null);
    setImgPreview("");
  };

  const submitCreatePost = () => {
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

    // if (text.length > 1000) {
    //   setErrorMessage("Post must less than 1000 characters");
    //   alert("Post must less than 1000 characters");
    //   return;
    // }

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
    formData.append("file", imgUpload);

    Axios.post(
      `/post/new`,
      // {
      //   text: text,
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
        //   props.whitePencil();
        props.setEditUserModalOpen(false);
        //   history.push(`/post/${props.postid}`);
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
  console.log("bioText.length", bioText.length);
  console.log("imgUpload", imgUpload)
  // bioText.length == 0 && !{ imgUpload };

  return (
    <div
      className="create-post-modal"
      onClick={() => {
        props.setEditUserModalOpen(false);
      }}
    >
      <div
        className="create-post-modal-content"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div id="create-post-header">
          <div id="create-post-header-top">
            <div id="create-post-header-title">Edit Your Profile</div>
            <span
              className="close-create-post"
              onClick={() => {
                props.setEditUserModalOpen(false);
              }}
            >
              &times;
            </span>
          </div>
        </div>
        <form id="create-post-container">
          <input />
          <input />
          <input />
          <div id="create-post-mid-row">
            {/* <div className="card-row-one">
              <div className="prof-icon"></div>
              <div className="flex-down card-title">
                <div className="create-post-username">
                  {props.currentUser.firstname} {props.currentUser.lastname}
                </div>
              </div>
            </div> */}
            {/* <input
                          id="woym-input"
                          type="textarea"
              className="input-create-post"
              placeholder={`What's on your mind, ${props.currentUser.firstname}?`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            /> */}
            {/* <textarea
              id="woym-input"
              type="textarea"
              className="input-create-post"
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
            {/* <div className="error-message-create-post">{errorMessage}</div> */}
          </div>
          <div id="create-post-img-row">
            {addImageOpen ? (
              <div className="create-post-image-upload">
                <FileUploaderUser
                  id="create-post-form-img-upload"
                  onFileSelectSuccess={(file) => setImgUpload(file)}
                  onFileSelectError={({ error }) => alert(error)}
                  //   resetImgForm={resetImgForm}
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
                Update Profile Picture
              </div>
            )}
          </div>
          <div id="create-post-bottom-row">
            {bioText.length == 0 && (!imgUpload) ? (
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
                Save
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
