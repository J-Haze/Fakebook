import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";

import Card from "../../HomePage/Sections/Card.js";

import "../UserPage.css";

function CurrentUserPage(props) {
    const [userPosts, setUserPosts] = useState([]);

    

    useEffect(() => {
        let userPostArray = [];


// let publishedComments = [];
//       for (let i = 0; i < res.data.length; i++) {
//         if (res.data[i].isPublished) {
//           if (publishedComments.length == 0 || publishedComments == undefined) {
//             publishedComments = [res.data[i]];
//           } else {
//             // console.log(publishedComments)
//             // console.log(res.data[i]);
//             // publishedComments.typeof()
//             // publishedComments = publishedComments.push(res.data[i]);
//             publishedComments.push(res.data[i]);
//           }
//         }
//       }
//       setDisplayedComments(publishedComments);
//       // setDisplayedComments(res.data);
//     });
//   };



        
    }, [props.displayedPosts])




    return (
      <div id="current-user-page">
        {/* <div id="user-page-content-cont"> */}
        <div id="user-info-cont">
          <div id="user-info-box">Bio</div>
          <div id="user-friends-box"></div>
        </div>
        <div id="user-post-cont">
          <div id="new-post-card">
            <div id="new-post-card-top" className="new-post-card-row">
              <div className="prof-icon">{/* <ProfileImage /> */}</div>
              <div
                id="woym-btn"
                onClick={() => {
                  props.setCreatePostModalOpen(true);
                }}
              >
                What's on your mind, {props.currentUser.firstname}?
              </div>
            </div>
            {/* <div
                id="new-post-card-bottom"
                className="new-post-card-row"
              ></div> */}
          </div>
          {/* <div className="main-subtitle">All Posts:</div> */}
          {props.displayedPosts.map((post) =>
            post.isPublished ? (
              <Card
                key={post._id}
                post={post}
                currentUser={props.currentUser}
                fetchPosts={props.fetchPosts}
              />
            ) : (
              ""
            )
          )}
        </div>
        {/* </div> */}
      </div>
    );
}

export default CurrentUserPage;
