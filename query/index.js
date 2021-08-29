import express from "express";
import cors from "cors";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//To optimised api calls one single request which will give all comments and post in one call rather than calling it many times
//This is only for reading data the post and comment service are 100% incharge of creating posts


const posts = {};
app.get("/posts", (req, res) => {
  res.send(posts);
});


app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type == "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type == "CommentCreated") {
    const { id, content, postId } = data;
    const post = posts[postId];
    console.log(post);
    post.comments.push({ id, content });
  }

  res.send({});
});


app.listen(4002, () => {
  console.log("Listening on 4002");
});
