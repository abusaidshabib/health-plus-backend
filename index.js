const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

async function run() {
  try {

    const db = client.db("health-plus");
    const allServices = db.collection("services");
    const reviewCollection = db.collection("reviews");
    const available = db.collection("timeslots");
    const bookingCollection = db.collection("booking");
    const faqCollection = client.db("hexa_bazaar").collection("faq");

    app.get("/services", async (req, res) => {
      let query = {};
      const sort = { index: -1 }
      const data = await allServices.find(query).sort(sort).toArray();
      res.send(data);
    })

    app.get("/available/:service", async (req, res) => {
      const service = req.params.service;
      const query = { service: `${service}` };
      const data = await available.findOne(query);
      res.send(data);
    })

    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(`${id}`) };
      const service = await allServices.findOne(query);
      res.send(service);
    })

    app.get("/review", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email
        }
      }
      const data = reviewCollection.find(query);
      const reviews = await data.toArray();
      res.send(reviews);
    })

    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      query = { sid: `${id}` }
      const data = await reviewCollection.find(query).toArray();
      res.send(data);
    })

    app.get("/faq", async (req, res) => {
      const data = await faqCollection.find().toArray();
      res.send(data)
    })

    app.post("/services", async (req, res) => {
      const data = req.body;
      const result = await allServices.insertOne(data);
      res.send(result);
    })

    app.post("/booking", async(req, res) => {
      const data = req.body;
      const result = await bookingCollection.insertOne(data);
      res.send(result);
    })

    app.post("/reviews", async (req, res) => {
      const sendreview = req.body;
      const data = await reviewCollection.insertOne(sendreview);
      res.send(data)
    })

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    })

    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(`${id}`) };
      const data = req.body;
      const options = { upsert: true };
      const upDate = {
        $set: {
          review: data.review
        }
      }
      const result = await reviewCollection.updateMany(filter, upDate, options);
      res.send(result);
    })

  }
  finally {

  }
}

run().catch(error => console.error(error))

app.get("/", async (req, res) => {
  res.send("Health-plus is running")
})

app.listen(port, () => {
  console.log(`Health app running on port ${port}`)
})

