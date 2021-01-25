import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import "./CreatePostModal.css";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

// import Editor from "../../HelperComponents/Editor";

const filter = new badWords();

function CreatePostModal(props) {
//   const [title, setTitle] = useState(props.initialTitle);
  const [text, setText] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return function cleanup() {
      props.setCreatePostModalOpen(false);
    };
  }, []);

  const history = useHistory();

  const submitCreatePost = () => {
    console.log("submitted");
  };

  //   const submitCreatePost = () => {
  //     if (filter.isProfane(title)) {
  //       alert("Title contains a word that is not allowed.");
  //       setTitle("");
  //       return;
  //     }

  //     if (title.length < 1) {
  //       setErrorMessage("Title field must not be blank");
  //       return;
  //     }

  //     if (title.length > 100) {
  //       setErrorMessage("Title field must less than 100 characters");
  //       return;
  //     }

  //     if (mainText.length < 1) {
  //       setErrorMessage("Post body must not be empty");
  //       return;
  //     }

  //     if (mainText.length > 10000) {
  //       setErrorMessage("Post body must be less than 10,000 characters");
  //       return;
  //     }

  //     Axios.put(
  //       `/post/${props.postid}`,
  //       {
  //         title: title,
  //         text: mainText,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${JSON.parse(
  //             window.localStorage.getItem("token")
  //           )}`,
  //         },
  //       }
  //     )
  //       .then((res, err) => {
  //         setErrorMessage("");
  //         props.fetchBlogs();
  //         props.whitePencil();
  //         props.hideEditModal();
  //         history.push(`/post/${props.postid}`);
  //       })
  //       .catch((error) => console.log("error", error));
  //   };

  //   let handleEditorChange = (content, editor) => {
  //     setMainText(content);
  //   };

  //   let goBack = () => {
  //     props.whitePencil();
  //     props.hideEditModal();
  //   };

  return (
    <div className="create-post-modal">
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
            {/* <div className="error-message-create-post">{errorMessage}</div> */}
          </div>
          <div id="create-post-img-row">
            <div id="add-img-btn">Add Image to Your Post</div>
          </div>
          <div id="create-post-bottom-row">
            {text.length == 0 ? (
              <div
                id="submit-create-post-empty"
                className="submit-create-post"
              >
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
