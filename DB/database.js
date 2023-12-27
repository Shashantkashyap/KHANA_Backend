const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

const DB = process.env.MONGODB_URL;

const client = new MongoClient(DB);

const mongoDB = async () => {
  await mongoose
    .connect(DB)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log("error in db connection" + err.message));
};

module.exports = { mongoDB, client };
