import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useHistory } from "react-router-dom";

// import thumbBlack from "../../../../assets/thumbs-up-solid.svg";
import thumbBlack from "../../../../assets/thumbs-up-regular-gray.svg";
import thumbBlue from "../../../../assets/thumbs-up-solid-light-blue.svg";

import Comments from "./Comments";
// import { like_post } from "../../../../../../server/controllers/post_controller";

// https://fontawesome.com/icons/thumbs-up?style=light

function Card(props) {
  const [displayedComments, setDisplayedComments] = useState([]);

  // const [commentRefresher, setCommentRefresher] = useState(true);

  // const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  // const [commentToDelete, setCommentToDelete] = useState("");

  const [likeCount, setLikeCount] = useState(0);
  // const [commentCount, setCommentCount] = useState(
  //   Math.floor(Math.random() * 21)
  // );
  const [commentCount, setCommentCount] = useState(0);

  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);

  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);

  const history = useHistory();

  //Code that calculates like Count

  //Code that calculates commentCount

  //Code that searches for current user in the liked list and then sets likedByCurrentUser

  function likePost() {
    setLikedByCurrentUser(true);
    Axios.put(
      `/post/${props.post._id}/like`,
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
        console.log("liked");
        setLikedByCurrentUser(true);

        //  props.fetchPosts();
        //  history.push(`/user/${currentUser._id}`);
        //  history.go(0);
      })
      .catch((error) => {
        console.log("error", error);
        setLikedByCurrentUser(false);
        //  alert("Cannot like this post.");
      });
  }

  function unlikePost() {
    setLikedByCurrentUser(false);
    Axios.put(
      `/post/${props.post._id}/unlike`,
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
        console.log("unliked");
        setLikedByCurrentUser(false);

        //  props.fetchPosts();
        //  history.push(`/user/${currentUser._id}`);
        //  history.go(0);
      })
      .catch((error) => {
        console.log("error", error);
        setLikedByCurrentUser(true);
        //  alert("Cannot like this post.");
      });
  }

    function checkIfLiked() {
      console.log("here1");
      if (
        props.post.likesList.length == 0 ||
        props.post.likesList.length == undefined
      ) {
        console.log("here2");
        setLikedByCurrentUser(false);
        return;
      }
      if (props.post.likesList.indexOf(props.currentUser._id) != -1) {
        console.log("here3");
        setLikedByCurrentUser(true);
      } else {
        setLikedByCurrentUser(false);
      }
    }

    useEffect(() => {
      checkIfLiked();
    }, []);

  function toggleLike() {
    if (likedByCurrentUser == false) {
      //Use "like backend"
      likePost();
    } else {
      console.log("unliked");
      // setLikedByCurrentUser(false);
      //Use "unlike" backend!
      unlikePost();
    }
  }

  // function showComments() {
  //   //Need to add
  //   console.log("show comments");
  // }

  function deletePost(postid) {
    Axios.put(
      `/post/${props.post._id}/unpublish`,
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
        //  if (res.data.message) {
        //    alert(res.data.message);
        //    return
        //  }
        setDeletePostModalOpen(false);
        props.fetchPosts();
        //  history.push(`/user/${currentUser._id}`);
        history.go(0);
      })
      .catch((error) => {
        console.log("error", error);
        alert("Cannot delete this post.");
      });
  }

  const fetchComments = () => {
    Axios.get(`/post/${props.post._id}/comments`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("token")
        )}`,
      },
    }).then((res) => {
      let publishedComments = [];
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].isPublished) {
          if (publishedComments.length == 0 || publishedComments == undefined) {
            publishedComments = [res.data[i]];
          } else {
            // console.log(publishedComments)
            // console.log(res.data[i]);
            // publishedComments.typeof()
            // publishedComments = publishedComments.push(res.data[i]);
            publishedComments.push(res.data[i]);
          }
        }
      }
      setDisplayedComments(publishedComments);
      // setDisplayedComments(res.data);
    });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    setCommentCount(displayedComments.length);
  }, [displayedComments]);



  function calculateLikes() {
    if (
      props.post.likesList.length == 0 ||
      props.post.likesList.length == undefined
    ) {
      setLikeCount(0);
      return;
    } else {
      setLikeCount(props.post.likesList.length);
    }
  }

  useEffect(() => {
    calculateLikes();
  }, [likedByCurrentUser]);

  // function deleteComment() {
  //     Axios.put(
  //       `/post/${props.post._id}/${commentToDelete}/unpublish`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${JSON.parse(
  //             window.localStorage.getItem("token")
  //           )}`,
  //         },
  //       }
  //     )
  //       .then((res) => {
  //         fetchComments();
  //         hideDeleteCommentModal();
  //         history.push(`/post/${props.post._id}`);
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   }

  //   const openDeleteCommentModal = (commentid) => {
  //     setCommentToDelete(commentid);
  //     setDeleteCommentModalOpen(true);
  //   };

  //   const hideDeleteCommentModal = () => {
  //     setCommentToDelete("");
  //     setDeleteCommentModalOpen(false);
  //   };

  //Close comments on unmount
  useEffect(() => {
    return function cleanup() {
      setCommentsOpen(false);
    };
  }, []);

  function toggleCommentsOpen() {
    if (commentsOpen == true) {
      setCommentsOpen(false);
    } else {
      setCommentsOpen(true);
    }
  }

  return (
    <div
      className="card"
      onClick={() => {
        setDeletePostModalOpen(false);
      }}
    >
      <div className="main-card">
        <div className="card-row-one">
          <div className="prof-icon"></div>
          {/* <UserAvatar user={post.author} /> */}
          <div className="flex-down card-title">
            <Link
              className="link card-username hover-under"
              to={`/user/${props.post.author._id}`}
            >
              {props.post.author.firstname} {props.post.author.lastname}
            </Link>

            {/* <div className="card-username hover-under">
              {props.post.author.firstname} {props.post.author.lastname}
            </div> */}

            <div className="card-date">
              {moment(props.post.createdAt).format("ll")} at{" "}
              {moment(props.post.createdAt).format("LT")}
            </div>
          </div>
          {props.post.author._id == props.currentUser._id ? (
            <span
              className="del-post-x"
              onClick={(event) => {
                event.stopPropagation();
                setDeletePostModalOpen(true);
              }}
            >
              &times;
            </span>
          ) : (
            ""
          )}
          {deletePostModalOpen ? (
            <div
              className="del-post-modal"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <div className="del-post-modal-text">Delete this post?</div>
              <div className="del-post-modal-btn-cont">
                <div
                  className="del-post-modal-confirm del-post-modal-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    deletePost();
                  }}
                >
                  Delete
                </div>
                <div
                  className="del-post-modal-cancel del-post-modal-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    setDeletePostModalOpen(false);
                  }}
                >
                  Cancel
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="card-row-two">{props.post.text}</div>
        {props.post.image ? (
          <div>
            <div>
              {props.post.image.filename && (
                <div>
                  <img
                    className="card-image"
                    src={`http://localhost:5000/uploads/${props.post.image.filename}`}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="card-row-three">
          {likeCount == 1 ? (
            <div className="like-count">{likeCount} Like</div>
          ) : (
            <div className="like-count">{likeCount} Likes</div>
          )}
          <div
            className="comment-count"
            onClick={() => {
              toggleCommentsOpen();
            }}
          >
            {commentCount} Comments
          </div>
        </div>
        <div className="card-row-four">
          <div
            className="like-box"
            onClick={() => {
              toggleLike();
            }}
          >
            {likedByCurrentUser ? (
              <div className="flex">
                <img src={thumbBlue} className="thumb"></img>
                <div className="blue">Like</div>
              </div>
            ) : (
              <div className="flex">
                <img src={thumbBlack} className="thumb"></img>
                <div className="black">Like</div>
              </div>
            )}
          </div>
          <div
            className="comment-box"
            onClick={() => {
              setCommentsOpen(true);
              //Focus on Comment input
            }}
          >
            Comment
          </div>
        </div>
      </div>
      <div className="card-row-five">
        {commentsOpen ? (
          <Comments
            comments={displayedComments}
            currentUser={props.currentUser}
            // isLoggedIn={props.isLoggedIn}
            fetchComments={fetchComments}
            postid={props.post._id}
            // openDeleteCommentModal={openDeleteCommentModal}
            // setCommentToDelete={setCommentToDelete}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Card;
