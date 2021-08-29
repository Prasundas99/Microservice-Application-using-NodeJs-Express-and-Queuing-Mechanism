import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";
function PostList() {
  const [posts, setPosts] = useState({});

  const fetchPost = async () => {
    const res = await axios.get("http://localhost:4000/posts");

    setPosts(res.data);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const redderedPosts = Object.values(posts).map((post) => {
    //Object.values() converts object to array
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
            <CommentList postId={post.id}/>
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return (
    <>
      <h1>Posts</h1>
      <div className="d-flex flex-row flex-wrap justify-content-between">
        {redderedPosts}
      </div>
    </>
  );
}

export default PostList;