import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";
function PostList() {
  const [posts, setPosts] = useState({});
const [pending, isPending] = useState(-1)


  const fetchPost = async () => {
    const res = await axios.get("http://localhost:4002/posts");
    setPosts(res.data);
  };

  useEffect(() => {
      fetchPost();
      console.log("Rendered");
  }, [pending]);


  
  const redderedPosts = Object.values(posts).map((post) => {
     post && post.comments.map((comment) =>{
            if (comment.status === "pending") {
              setTimeout(function(){ isPending(pending+1); console.log(pending); }, 4000); //rerender the page hence calling the api if the comment made is still pending
      }
      })
     
    //Object.values() converts object to array
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments}/>
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
