const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors")
const mongoDB = require("./DB/database");

const PORT = process.env.PORT || 6000;

mongoDB.mongoDB();

app.use(cors({
    origin: process.env.FRONT_URL,
    credentials: true,  // Enable credentials (cookies, authorization headers)
  }));

  app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","http://localhost:5173");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.json());

app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/order"));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log("app is listening on port no." + PORT);
});
