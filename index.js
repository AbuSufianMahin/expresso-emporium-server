require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Expresso Emporium Coffee Shop is running");
})

const uri = `mongodb+srv://${process.env.EXPRESSO_MONGO_ADMIN_NAME}:${process.env.EXPRESSO_MONGO_ADMIN_PASS}@cluster0.udgfocl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const coffeeCollection = client.db('coffeeDB').collection('coffees')

    app.get('/coffees', async (req, res) => {
      const allCoffeeData = await coffeeCollection.find().toArray();
      res.send(allCoffeeData);
    })

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);

      res.send(result);

    })

    app.post('/coffees', async (req, res) => {
      const coffeeData = req.body;
      const result = await coffeeCollection.insertOne(coffeeData);

      res.send(result)
    })


    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;

      // getting the matching collection (query)
      const query = { _id: new ObjectId(id) };

      const updatedData = req.body;

      const updateDoc = {
        $set: updatedData
      }

      const result = await coffeeCollection.updateOne(query, updateDoc);

      res.send(result);
    })

    app.delete(`/coffees/:id`, async(req, res)=>{
      const id = req.params.id;
      
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);

      res.send(result)
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log("Expresso Emporium server running on port: ", port);
})