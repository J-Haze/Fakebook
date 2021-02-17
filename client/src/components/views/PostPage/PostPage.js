import React from "react";
import Card from "../HomePage/Sections/Card.js";
import { useState, useEffect } from "react";

import "./PostPage.css";

function PostPage(props) {
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    setIsFriend(false);

    //Checks if post author is in friendList
    for (let i = 0; i < props.currentUser.friendList.length; i++) {
      if (props.currentUser.friendList[i]._id == props.post.author._id) {
        setIsFriend(true);
      }
    }

    //Checks if you're the post author
    if (props.currentUser._id === props.post.author._id) {
      setIsFriend(true);
    }
  }, [props.currentUser, props.currentUser.friendList]);

  return (
    <div id="post-page">
      {!isFriend || !props.post.isPublished ? (
        <div id="not-authorized">
          {" "}
          This post has either been deleted, or you do not have permission to
          view this post.
        </div>
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
