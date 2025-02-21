const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const taskCollection = database.collection("tasks");



    // tasks related apis 
    app.post('/tasks', async(req, res) => {
      const tasks = req.body;
      const result = await taskCollection.insertOne(tasks);
      res.send(result);
    })
    app.get('/tasks/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
    
     
        const result = await taskCollection.find(query).toArray();
        
       res.send(result)
    });

    
    

    // Update task status
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  const filter = { _id: new ObjectId(taskId) };
  const updateDoc = {
    $set: {
      status: status,
    },

    
  };

  const result = await taskCollection.updateOne(filter, updateDoc);
  res.send(result);
});


// Delete task by id
// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const result = await taskCollection.deleteOne({ _id: new ObjectId(taskId) });

    // Check if a task was deleted
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Task not found' });
    }

    res.send({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send({ message: "An error occurred while deleting the task." });
  }
});




  





    // users related apis 
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