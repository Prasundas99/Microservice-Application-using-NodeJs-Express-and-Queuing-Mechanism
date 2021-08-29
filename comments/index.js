import express from "express";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

/**
 * @description of Comment service
 * @summary: Service to POST and GET comments respected to a  specific post.
 * @requires postID from parameter, so that it dosent need to create an event to get specific id from post
 * @returns: data:{ id: commentId, content, postId: req.params.id  }
 */

//For dummy data instead of realtime db
const commentsByPostId = {};

/**
 * 
 */
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});


/**
 * 
 */
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[req.params.id] = comments;

 //TODO: why to post
  await axios.post(`http://localhost:4005/events`, {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });
  res.status(201).send(comments);
});


/**
 * 
 */
app.post("/events", (req, res) => {
  console.log("Recived event of:", req.body.type); //To get type of event
  res.send({});
});


app.listen(4001, () => {
  console.log("Comment service Listening on port number 4001");
});
