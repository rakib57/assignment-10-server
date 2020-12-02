const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_User}:${process.env. DB_Pass}@cluster0.aea4t.mongodb.net/${process.env. DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) =>{
    res.send('hellow world')
})



client.connect(err => {
  const eventsCollection = client.db("volunteerNetworkDB").collection("events");
  const worksCollection = client.db("volunteerNetworkDB").collection("works");
  
  app.post('/addEvents', (req,res) =>{
      const evevt = req.body
      eventsCollection.insertMany(evevt)
      console.log(evevt)
      .then(result => {
          res.send(result.insertCount)
      })
        
  })

  app.get('/works', (req, res) =>{
    eventsCollection.find({})
    .toArray( (err, documents) => {
        res.send(documents);
    })
})

app.post('/addSector', (req, res) => {
    const sector = req.body;
    worksCollection.insertMany(sector)
    .then(result =>{
        res.send(result.insertedCount)
    })
})

app.get('/sector', (req, res) => {
    worksCollection.find({})
    .toArray( (err, documents) =>{
        res.send(documents)
    })
})

app.delete('/delete/:key', (req, res) => {
    worksCollection.deleteOne({key: req.params.key})
    .then(result => {
        res.send(result.deletedCount > 0)
    })
})



});

app.listen(5000)