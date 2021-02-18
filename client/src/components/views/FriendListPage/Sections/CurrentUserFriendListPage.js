import React from "react";

import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

function CurrentUserFriendListPage(props) {
  const history = useHistory();

  return (
    <div id="current-user-friend-list-side">
      <div id="current-user-fl-side-header">Friends:</div>
      <div
        id="current-user-fl-side-requests-cont"
        className="current-user-fl-side-cont"
      >
        {props.receivedRequestsCount == 1 ? (
          <div id="current-user-fl-side-subheader">1 Friend Request</div>
        ) : (
          <div id="current-user-fl-side-subheader">
            {props.receivedRequestsCount} Friend Requests
          </div>
        )}

        {props.receivedRequests == "" ? (
          <div className="no-new-requests">No new requests</div>
        ) : (
          props.receivedRequests.map((request) =>
            request.sender.isPublished ? (
              <div className="friend-request-card" key={request._id}>
                <Link className="link" to={`/user/${request.sender._id}`}>
                  <img
                    className="prof-pic-friendList-request-page"
                    alt={`profile-pic-user-${request.sender.firstname}-${request.sender.lastname}`}
                    src={`${request.sender.photo.url}`}
                  />
                </Link>
                <div className="friend-request-card-info">
                  <div
                    className="friend-request-card-username"
                    onClick={() => {
                      history.push(`/user/${request.sender._id}`);
                    }}
                  >
                    {request.sender.firstname} {request.sender.lastname}
                  </div>
                  <div className="friend-request-card-btn-cont">
                    <div
                      className="friend-request-card-btn-confirm"
                      onClick={() => {
                        props.acceptRequest(request._id, request.sender._id);
                      }}
                    >
                      Confirm
                    </div>
                    <div
                      className="friend-request-card-btn-decline"
                      onClick={() => {
                        props.declineRequest(request._id);
                      }}
                    >
                      Delete
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )
          )
        )}
      </div>
      <div
        id="current-user-fl-side-pending-cont"
        className="current-user-fl-side-cont"
      >
        {props.sentRequestsCount == 1 ? (
          <div id="current-user-fl-side-subheader-pending">
            1 Request Pending
          </div>
        ) : (
          <div id="current-user-fl-side-subheader-pending">
            {props.sentRequestsCount} Requests Pending
          </div>
        )}
        {props.sentRequestsCount == "" ? (
          <div className="no-new-requests">No pending requests</div>
        ) : (
          props.sentRequests.map((request) =>
            request.receiver.isPublished ? (
              <div className="friend-request-card" key={request._id}>
                <Link className="link" to={`/user/${request.receiver._id}`}>
                  <img
                    className="prof-pic-friendList-request-page"
                    alt={`profile-pic-user-${request.receiver.firstname}-${request.receiver.lastname}`}
                    src={`${request.receiver.photo.url}`}
                  />
                </Link>
                <div className="friend-request-card-info">
                  <div
                    className="friend-request-card-username"
                    onClick={() => {
                      history.push(`/user/${request.receiver._id}`);
                    }}
                  >
                    {request.receiver.firstname} {request.receiver.lastname}
                  </div>
                  <div className="friend-request-card-btn-cont">
                    <div className="friend-request-card-btn-pending">
                      Request Pending
                    </div>
                    <div
                      className="friend-request-card-btn-cancel"
                      onClick={() => {
                        props.cancelRequest(request._id);
                      }}
                    >
                      Cancel
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )
          )
        )}
        <div className="top-border-gray"></div>
        <div
          className="no-posts-btn"
          onClick={() => {
            history.push("/find-friends");
          }}
        >
          {" "}
          Find Friends
        </div>
      </div>
    </div>
  );
}

export default CurrentUserFriendListPage;
