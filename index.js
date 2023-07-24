const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.port || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nuouh7o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const collegeCollection = client
      .db("college-server")
      .collection("colleges");
    const admissionCollection = client
      .db("college-server")
      .collection("admission");
    app.get("/college", async (req, res) => {
      const searchTerm = req.query.collegeName;

      const query = searchTerm
        ? {
            college_name: { $regex: new RegExp(searchTerm, "i") },
          }
        : {};
      const result = await collegeCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/college/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collegeCollection.findOne(query);
      res.send(result);
    }); 
 app.get('/admission', async(req,res)=>{
  const result = await admissionCollection.find().toArray() 
  res.send(result)
 })

    app.post("/admission", async (req, res) => {
      const data = req.body;
      const result = await admissionCollection.insertOne(data);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Data base connected SuccessFully");
});
app.listen(port, () => {
  console.log(`Collegy server running on port ${port}`);
});
