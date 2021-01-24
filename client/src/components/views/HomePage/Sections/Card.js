import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

function Card(props) {
  return (
    <div className="card">
      <div className="card-title">
        <Link className="link" to={`/post/${props._id}`}>
          {props.title}
        </Link>
      </div>
      <div className="card-subtitle">
        Posted by{" "}
        <Link className="link" to={`/user/${props.author_id}`}>
          <strong>{props.author}</strong>
        </Link>{" "}
        on {moment(props.createdAt).format("LLL")}
      </div>
    </div>
  );
}

export default Card;
