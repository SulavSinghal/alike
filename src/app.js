const express = require("express");
const connectdb = require("./config/database");
const app = express();
const User = require('./models/user');

//creating API for adding data in database 
app.post("/signup",async (req,res)=>{

    // creating instance of the user model
    const user = new User({
        firstName: "Sulav",
        lastName: "Singhal",
        emailId: "sulavsinghal01@gmail.com",
        password: "123",
        age: 21,
        gender: "Male"
    });
    await user.save();
    res.send("User added sucessfully") // to save the data in database
});




connectdb()
.then(()=>{
    console.log("Database connected succesfully");
    app.listen(7777,()=>{
        console.log("Server is successfully listening on port 7777...")
    })
}).catch(err=>{
    console.error("Database connection cannot be established")    
});
