import express from 'express'
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios'

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

/**
 * @description of Post service
 * @summary: Service to POST and GET posts given by user
 * @requires title  from req.body,
 * @returns: data:{id, title}
 */


//For dummy data instead of realtime db
const posts = {};

//To get all the post as object 
app.get("/posts", (req, res) => {
    res.send(posts)
})

/**
 * @description: Generates a post with a unique id with title given by user
 */
app.post("/posts", async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    /**
     * @description: Posted to event buswhich will be called by query service so that the user gets all content with less api calls 
     * also decreasing depedency of this service if this service goes down the user can stil able to view comments
     */
    await axios.post(`http://localhost:4005/events`, {
        type: 'PostCreated',
        data: {
            id, title
        }
    })
    res.status(201).send(posts[id]);
});


/**
 * @description: to get request from event to check wether the service is still alive and to fetch data from other service via async microservice rule
 */
app.post('/events', (req, res) => {
    console.log("Recived event", req.body.type);

    res.send({})
})


app.listen(4000, () => {
    console.log('Post service is Listening on port 4000');
})