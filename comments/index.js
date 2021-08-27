import express from "express";
import { randomBytes } from "crypto";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content });

  res.status(201).send(posts[id]);
  commentsByPostId[req.params.id] = comments;
  res.status(201).send(comments);
});

   
app.listen(4001, () => {
  console.log("Listening on 4001");
});
