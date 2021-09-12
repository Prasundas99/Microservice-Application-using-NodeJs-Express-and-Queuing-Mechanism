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
 * @description: Get all comments of each post by post id in array
 */
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

/**
 * @description: To post comment
 */
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments;

  /**
   * @description: Comment is sent to event queue which will be called by query service so that the user gets all content with less api calls
   * also decreasing depedency of this service if this service goes down the user can stil able to view comments
   */
   await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending'
    }
  });

  res.status(201).send(comments);
});

/**
 * @description: to get request from event to check wether the service is still alive and to fetch data from other service via async microservice rule
 */
app.post("/events", async(req, res) => {
  console.log("Recived event of:", req.body.type); //To get type of event

  const { type, data } = req.body;
  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find(comment => {
      return comment.id === id;
    });
    comment.status = status;

    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content
      }
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Comment service Listening on port number 4001");
});
