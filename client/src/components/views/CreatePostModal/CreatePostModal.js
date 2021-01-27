import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import "./CreatePostModal.css";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

// import Editor from "../../HelperComponents/Editor";

// import ImageUpload from "./Sections/ImageUpload.js"

const filter = new badWords();

function CreatePostModal(props) {
  //   const [title, setTitle] = useState(props.initialTitle);
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

  const history = useHistory();

  //   const submitCreatePost = () => {
  //     console.log("submitted");
  //   };

  const handleChange = (e) => {
    console.log("e.target.value:", e.target.value);
    setImgUpload(e.target.value);
    //   setImgPreview(URL.createObjectURL(e.target.value));
  };

  const handleCancel = () => {
    setImgUpload("");
    setImgPreview("");
  };

  const submitCreatePost = () => {
    if (filter.isProfane(text)) {
      alert("Post contains a word that is not allowed.");
      return;
    }

    if (text.length < 1) {
      setErrorMessage("Post must not be blank");
      alert("Post must not be blank");
      return;
    }

    if (text.length > 1000) {
      setErrorMessage("Post must less than 1000 characters");
      alert("Post must less than 1000 characters");
      return;
    }

    //   if (imgUpload) {
    //       const formData = new FormData();
    //       formData.append("img-file", imgUpload);
    //   } else {
    //       let formData = "";
    //   }

    console.log("here imgUpload", imgUpload);

    const formData = new FormData();
    console.log("formData1", formData);
    //   console.log("text", text);
      console.log("image", imgUpload);
    //   let textVar = text;
    //   let imageVar = imgUpload;
    //   let file = {
    //       text: textVar,
    //       image: imgUpload
    //   }
    formData.append("text", text);
    formData.append("image", imgUpload);
    //   formData.append("myFile", file)

    console.log("formData2", formData);

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
        props.fetchPosts();
        //   props.whitePencil();
        props.setCreatePostModalOpen(false);
        //   history.push(`/post/${props.postid}`);
      })
      .catch((error) => {
        alert("Failed to submit image.");
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

  return (
    <div
      className="create-post-modal"
      onClick={() => {
        props.setCreatePostModalOpen(false);
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
              <div className="prof-icon"></div>
              <div className="flex-down card-title">
                <div className="create-post-username">
                  {props.currentUser.firstname} {props.currentUser.lastname}
                </div>
                {/* <div className="card-date">
                  {moment(props.post.createdAt).format("ll")} at{" "}
                  {moment(props.post.createdAt).format("LT")}
                  Placeholder
                </div> */}
              </div>
            </div>
            {/* <input
                          id="woym-input"
                          type="textarea"
              className="input-create-post"
              placeholder={`What's on your mind, ${props.currentUser.firstname}?`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            /> */}
            <textarea
              id="woym-input"
              type="textarea"
              className="input-create-post"
              placeholder={`What's on your mind, ${props.currentUser.firstname}?`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
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
              <div id="create-post-img-upload-cont">
                {/* <ImageUpload /> */}
                {/* <form> */}
                <label htmlFor="image">Upload Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                //   value={imgUpload}
                  onChange={(e) => handleChange(e)}
                  accept="image/*"
                />

                {/* </form> */}
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
            {text.length == 0 ? (
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
