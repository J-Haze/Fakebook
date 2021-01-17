import React from "react";
import "./NotFound.css";

import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div id="not-found-page">
      <h3>Loading...</h3>
      <div>
        If page does not respond within 10 seconds:
        <Link className="link-not-found" to="/">
          <strong>Click here</strong>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
