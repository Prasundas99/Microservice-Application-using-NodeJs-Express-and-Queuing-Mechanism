import express from 'express';
import axios from 'axios';

const app = express();


app.use(express.urlencoded({extended: true})); 
app.use(express.json());

/**
 * @description this service will watch for events made to filter them out posts according to criteria
 * and send out the filter postto events which will br finally send to query 
 * from query the use can see weather their post was accepted or rejected till then moderation is going on will be shown to user
 */

app.post('/events',async(req,res) => {
const {type , data} = req.body;

if(type == 'CommentCreated'){
    const status = data.content.includes('orange')? 'rejected' : 'approved';
 
    await axios.post('http://localhost:4005/events',{
        type: 'CommentModerated',
        data:{
            id: data.id,
            postID: data.postID,
            status,
            content: data.content
        }
    })
}
 
} )

app.listen(4003, () => {
    console.log('Listening on 4003');
})