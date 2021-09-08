import express from "express";
import cors from "cors";

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
  if (type == "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type == "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  res.send({});
});


app.listen(4002, () => {
  console.log("Query service is Listening on 4002");
});
