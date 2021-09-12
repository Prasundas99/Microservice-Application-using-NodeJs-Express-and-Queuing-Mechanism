import express from 'express'
import axios from 'axios'

const app = express()

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

/**
 * @description: This service works as event bus as theory given by async microservices
 * It takes request from all the services generates an event and returns to the service which requires the event
 */

app.post('/events', (req, res)=> {
    const event = req.body;

    axios.post(`http://localhost:4000/events`, event)
    axios.post(`http://localhost:4001/events`, event)
    axios.post(`http://localhost:4002/events`, event)
    axios.post(`http://localhost:4003/events`, event)

    res.send({status: 'OK '});
})

app.listen(4005, ()=> {
    console.log('Event bus Listening on 4005');
})