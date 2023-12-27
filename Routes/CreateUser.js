const express = require("express");
const router = express.Router();
const User = require("../Models/User.Schema");
const mongoose = require("mongoose");

const mongoDB = require("../DB/database");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken")

const bcrypt = require("bcryptjs")
const key = process.env.JWT_SECRET;


// listing all the food items

router.post("/food", async (req, res) => {
  try {
    const foodCollection = mongoDB.client.db("KHANA").collection("food");
    

    const foodData =await foodCollection.find({}).toArray();
    const categoryCollection = mongoDB.client.db("KHANA").collection("Food-category");
    const categoryData =await categoryCollection.find({}).toArray();

   

    res.status(200).json([foodData , categoryData]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//Creating a new User

router.post(
  "/createUser",
  [
    body("email", "email is not valid").isEmail(),
    body("password", "password is Too short").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { name, email, password, location } = req.body;

    const check_email =await User.findOne({email});
    console.log(check_email)
    if(check_email){
      return res.status(400).json({success:false, message:  " User already registered"})
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(password, salt)
    try {

      
      await User.create({
        name: name,
        email: email,
        password: secPassword,
        location: location,
      });
      return res.json({ success: true, message: "User created" });
    } catch (err) {
      console.log("error in creating user" + err);

    }
  }
);

// login the registered user with email

router.post(
  "/login",
  [
    body("email", "email is not valid").isEmail(),
    body("password", "password is Too short").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const login = await User.findOne({ email });
      if (!login) {
        return res.status(400).json({ error: "User is not registered" });
      }
      //console.log("logi  Id" + login._id)

      const passCompare = await bcrypt.compare(password, login.password)
      if (passCompare) {
        const data = {
          user: {
            id: login._id
          }
        }
       // console.log(login);
       const authToken = jwt.sign(data, key)
       
        return res.status(200).json({login,success:true, authToken});
      }
      res.json({ success: false, message: "Invalid Password" });
    } catch (error) {
      res.json({ error: "Error in finding the registered User" });
    }
  }
);

module.exports = router;
