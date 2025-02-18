const express = require("express");
const connectdb = require("./config/database");
const app = express();
const User = require('./models/user');

app.use(express.json());//using middlewarres to convert json object to JS object

app.post("/signup",async (req,res)=> //creating API for adding data in database
    { 

    // creating instance of the user model
    const user = new User(req.body);  

    try{
    await user.save();
    res.send("User added sucessfully"); // to save the data in database
}catch(err){
    res.status(400).send("Error saving the user:" + err.message);
}
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
