const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://rohimsaga7:kepolu@toba-realestate.wmkwgds.mongodb.net/?retryWrites=true&w=majority&appName=toba-realestate";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("fbclone");

module.exports = { database };
