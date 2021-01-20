import React from "react";

function SignupModal(props) {
//   let action;
//   if (props.actionMessage === "delete") {
//     action = "delete";
//   } else {
//     action = "edit";
//   }

  return (
    <div className="signup-modal">
      <div
        className="signup-modal-content"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <span
          className="close"
          onClick={() => {
            props.setSignupModalOpen(false);
          }}
        >
          &times;
        </span>
        <div id="action-message">
          Are you sure you want to delete this post?
        </div>
        <div id="action-sub-message">This action cannot be undone.</div>
        <div id="submit-btn-cont">
          <div
            id="submit-decline"
            className="confirmation-btn"
            onClick={() => {
              props.setSignupModalOpen(false);
            }}
          >
            Cancel
          </div>
          <div
            id="submit-confirmation"
            className="confirmation-btn"
            onClick={() => {
            //   props.deletePost(props.postid);
            }}
          >
            Delete
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupModal;
