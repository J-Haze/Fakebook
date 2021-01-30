import React, { useRef } from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import "./CreatePostModal.css";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

import FileUploader from "./Sections/FileUploader";

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
    console.log("e.target:", e.target);
    setImgUpload(e.target.value);
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
    // if (filter.isProfane(text)) {
    //   alert("Post contains a word that is not allowed.");
    //   return;
    // }

    if (text.length < 1 && imgUpload == "") {
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

    //Get rid of so that you can submit posts without images too
    //   if (!imgUpload) {
    //       alert("Please upload an image")
    //       return
    //   }

    console.log("typeOf", typeof imgUpload);

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
    formData.append("file", imgUpload);
    //   formData.append("myFile", file)

    console.log({ imgUpload });

    console.log("formData2", formData);
    console.log({ formData });

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
        setText("");
        //   props.whitePencil();
        props.setCreatePostModalOpen(false);
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
              <div className="create-post-image-upload">
                <FileUploader
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
                Add Image to Your Post
              </div>
            )}
          </div>
          <div id="create-post-bottom-row">
            {text.length == 0 && !{ imgUpload } ? (
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
