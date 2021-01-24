import React, { useState, useEffect } from "react";
import "./HomePage.css";

function HomePage(props) {
    const [allBlogs, setAllBlogs] = useState([]);
    // const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allFriends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    const history = useHistory();

    const fetchPosts = () => {
      setLoading(true);
      Axios.get("/").then((res) => {
        let allBlogsArray = res.data;
        let reversedArray = allBlogsArray.reverse();
        setAllBlogs(allBlogsArray.reverse());
        setDisplayedBlogs(allBlogsArray.reverse());
        setLoading(false);
      });
    };

    useEffect(() => {
      fetchBlogs();
    }, []);

    const fetchUsers = () => {
      Axios.get("/user/users").then((res) => {
        setAllUsers(res.data);
      });
    };

    useEffect(() => {
      fetchUsers();
    }, []);

    useEffect(() => {
      Axios.get("/user/", {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
      })
        .then((res) => {
          setCurrentUser(res.data);
          setIsLoggedIn(true);
        })
        .catch((error) => console.log("error", error));
    }, [tokenRefresh]);

  return (
    <>
      <div id="home">
        {props.loading ? (
          <div>Loading... </div>
        ) : blogCount === 0 ? (
          <div className="black-text no-blogs">
            No blogs have been posted yet.
          </div>
        ) : (
          <div id="home-blog-cont">
            <div className="main-subtitle">All Posts:</div>
            {props.displayedBlogs.map((post) =>
              post.isPublished ? (
                <Card
                  // key={post._id}
                  // _id={post._id}
                  // title={post.title}
                  // text={post.text}
                  // author={post.author}
                  // author_id={post.author_id}
                  // createdAt={post.createdAt}
                  // updatedAt={post.updatedAt}
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
