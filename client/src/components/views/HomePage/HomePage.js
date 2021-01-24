import React, { useState, useEffect } from "react";
import "./HomePage.css";

import Card from "./Sections/Card.js";

function HomePage(props) {
  const [postCount, setPostCount] = useState(0);

  let postCountVar;
  useEffect(() => {
    let postCountVar = 0;
    if (props.displayedPosts.length > 0) {
      props.displayedPosts.forEach(function (post) {
        if (post.isPublished) {
          postCountVar++;
        }
      });
      setPostCount(postCountVar);
    }
  }, [props.displayedPosts]);

  return (
    <> 
      <div id="home">
        {props.loading ? (
          <div>Loading... </div>
        ) : postCount === 0 ? (
          <div className="black-text no-blogs">
              No posts have been posted yet.
                 {props.currentUser}
          </div>
        ) : (
          <div id="home-blog-cont">
            <div className="main-subtitle">All Posts:</div>
                {props.displayedPosts.map((post) =>
                  post.isPublished ? (
                    <Card
                      key={post._id}
                      post={post}
                />
              ) : (
                ""
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;
