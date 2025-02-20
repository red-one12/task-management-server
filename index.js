const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjl69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const database = client.db("TaskManagerDB");
    const userCollection = database.collection("users");


    app.post('/users', async(req, res) => {
      const users = req.body;
      const result = await userCollection.insertOne(users);
      res.send(result);
    })

    app.get('/users', async(req, res) => {
      const users = userCollection.find();
      const result = await users.toArray();
      res.send(result);
    })


    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query); // FIXED: Use findOne() instead of find()
  
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user);
  });

  

















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send('Hello From Task Manager!!!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})