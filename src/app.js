const express = require("express");
const connectdb = require("./config/database");
const app = express();
const User = require('./models/user');
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());//using middlewarres to convert json object to JS object

app.post("/signup",async (req,res)=>{//creating API for adding data in database
   

try{  
    //validation the data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;// to get password

    //encrypt the password
        const passwordHash = await bcrypt.hash(password,10);

    // creating instance of the user model
        const user = new User({
            firstName, lastName,emailId,
            password: passwordHash,
    });  

        await user.save();
        res.send("User added sucessfully"); // to save the data in database
    }catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
});

app.post("/login",async (req,res)=>{
    try{

        const { emailId, password } = req.body;
        



    }catch(err){
        res.status(400).send("ERROR :" + err.message);
    }

});



//Feed API - GET /feed - get all the users from the database
app.get("/user",async (req,res) => {

    const userEmail = req.body.emailId;

    try{
       const users = await User.find({emailId: userEmail}); 
       if(users.length === 0){
        res.status(404).send("user not found");
       }else
       {
        res.send(users);
       }
    } catch(err){
        res.status(400).send("Something went wrong");
    }
   
});


//DELete API-delete user by ID
 app.delete("/user",async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user  = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully!");
    }catch(err)
    {
        res.status(400).send("Something went wrong");
    }

 });


//UPDATE the data of the user
app.patch("/user",async (req,res)=>{
    const userId = req.params?.userId; // we need to pass the userid in the API call to use params 
    const data = req.body;
    

    try{
        //VAlidating API calls
        const ALLOWED_UPDATES = ["userId","photoUrl","about","gender","age","skills"];
        const isUpdateAllowed = Object.keys(data).every((k) =>
        ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed)
        {
            throw new Error("Update not allowed!");
        }
        if(data?.skills.length>20)
        {
            throw new Error("Not allowed more than 20 skills")
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            //to make sure that validation works on patch
            returnDocument: "after",
            runValidators : true,
        });
        res.send("Data Updated Successfully");
    } catch (err){
      res.status(400).send("UPDATE FAILED" + err.message);
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
