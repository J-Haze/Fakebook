import React from "react";
import Card from "../HomePage/Sections/Card.js";

import { useState, useEffect } from "react";
import Axios from "axios";

function UserPage(props) {

  return (
    <div id="post-page">
      <Card
        key={props.post._id}
        post={props.post}
        currentUser={props.currentUser}
        fetchPosts={props.fetchPosts}
        sendNotification={props.sendNotification}
      />
    </div>
  );
}

export default UserPage;
