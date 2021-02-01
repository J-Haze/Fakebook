import React from "react";
import { useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Axios from "axios";

import badWords from "bad-words";
import { useHistory } from "react-router-dom";

const filter = new badWords();

function Comments(props) {
  const [newComment, setNewComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState("");

  const history = useHistory();

  function deleteComment(commentid) {
    // Axios.put(
    //   `/post/${props.post._id}/unpublish`,
    //   {},
    //   {
    //     headers: {
    //       Authorization: `Bearer ${JSON.parse(
    //         window.localStorage.getItem("token")
    //       )}`,
    //     },
    //   }
    // )
    //   .then((res) => {
    //     //  if (res.data.message) {
    //     //    alert(res.data.message);
    //     //    return
    //     //  }
    //     setDeletePostModalOpen(false);
    //     props.fetchPosts();
    //     //  history.push(`/user/${currentUser._id}`);
    //     history.go(0);
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //     alert("Cannot delete this post.");
    //   });

    console.log(commentid);
    }
    
    console.log("comment:", props.comment)

  return (
    (
              <div key={props.comment._id} className="comment">
                <div className="comment-row-one">
                  <div className="prof-icon-small"></div>
                  <div className="comment-cont-inner">
                    <div className="comment-bubble">
                      <div className="comment-username hover-under">
                        {props.comment.author.firstname} {props.comment.author.lastname}
                      </div>
                      <div className="comment-text">{props.comment.text}</div>
                    </div>
                    {props.comment.author._id === props.currentUser._id ? (
                      <span
                        className="del-comment-x"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDeleteCommentModalOpen(true);
                        }}
                      >
                        &times;
                      </span>
                    ) : (
                      ""
                    )}
                    {deleteCommentModalOpen ? (
                      <div
                        className="del-post-modal"
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      >
                        <div className="del-post-modal-text">
                          Delete this post?
                        </div>
                        <div className="del-post-modal-btn-cont">
                          <div
                            className="del-post-modal-confirm del-post-modal-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteComment(props.comment._id);
                            }}
                          >
                            Delete
                          </div>
                          <div
                            className="del-post-modal-cancel del-post-modal-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              setDeleteCommentModalOpen(false);
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
                  {/* <div
                    className="comment-delete"
                    onClick={() => {
                      // props.openDeleteCommentModal(comment._id);
                    }}
                  >
                    Delete
                  </div> */}
                </div>
                <div className="comment-row-two">
                  <div className="comment-like hover-under">Like</div>
                  <div className="comment-time">
                    · {moment(props.comment.createdAt).fromNow()}
                  </div>
                </div>

                {/* <div className="comment-author flex">
                  <Link
                    className="comment-link space-small"
                    to={`/user/${comment.author}`}
                  >
                    - Commented by <strong>{comment.username}</strong>
                  </Link>{" "}
                  on {moment(comment.createdAt).format("LLL")}
                  <div className="space-small">- </div>
                </div> */}
              </div>
            )
        )
}

export default Comments;
