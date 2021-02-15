import React from "react";
import Card from "../HomePage/Sections/Card.js";

import { useState, useEffect } from "react";
import Axios from "axios";

import "./PostPage.css";

function PostPage(props) {
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    if (props.currentUser.friendList.indexOf(props.post.author._id) != -1) {
      setIsFriend(true);
      console.log("one");
    } else {
      if (props.currentUser._id === props.post.author._id) {
        setIsFriend(true);
        console.log("two");
      } else {
        setIsFriend(false);
        console.log("three");
      }
    }
  }, [props.currentUser, props.currentUser.friendList]);

  return (
    <div id="post-page">
      {!isFriend || !props.post.isPublished ? (
        <div id="not-authorized"> Not authorized</div>
      ) : (
        <Card
          key={props.post._id}
          post={props.post}
          currentUser={props.currentUser}
          fetchPosts={props.fetchPosts}
          sendNotification={props.sendNotification}
          fromUserPage={true}
        />
      )}
    </div>
  );
}

export default PostPage;
