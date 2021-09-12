import express from "express";
import cors from "cors";
import axios from 'axios'
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

/**
 * @description: To optimised api calls one single request which will give all comments and post in one call rather than calling it many times
 * This is only for reading data the post and comment service are 100% incharge of creating posts
 */


//Dummy data instead of db
const posts = {};


//Util function 
const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find(comment => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

/**
 * @description: Gives all the data to user
 * @returns object: 
 * {
     id: '9eb1e0b8',
     title: 'test3',
    comments: [
      { id: '82de0f69', content: 'hu' },
      { id: '7285d8ef', content: 'huhu' }
    ]
}
*/
app.get("/posts", (req, res) => {
  res.send(posts);
});

/**
 * @description: Gets the data from all other service and interprets them to get an optimised call from api
 */
app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  handelEvent(type, data)
  res.send({});
});


app.listen(4002, async () => {
  console.log("Query service is Listening on 4002");

  const res = await axios.get('http://localhost:4005/events');

  for (let event of res.data) {
    console.log('Processing event:', event.type);

    handleEvent(event.type, event.data);
  }
});
