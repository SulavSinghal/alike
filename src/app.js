const express = require("express");
const connectdb = require("./config/database");
const app = express();
const User = require('./models/user');
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

//using middlewares to convert json object to JS object
app.use(express.json());
app.use(cookieparser());

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
        if(!validator.isEmail(emailId))
            {
                throw new Error("Email is not valid!");
            }

        //extracting user info from database (User)
        const user = await User.findOne({emailId: emailId});
        
        if(!user){
            throw new Error ("Invalid Credentials!!!");
        }
        const IsPasswordValid = await bcrypt.compare(password,user.password);
        if(IsPasswordValid)
            {
                
                //create a JWT token
                const token = await jwt.sign({_id: user._id},"SulaV123",{
                    expiresIn: "7d",
                });

                console.log(token);
                // Add the token to cookie and send the respond back
                res.cookie("token",token,{
                    expires: new Date(Date.now() + 8 * 3600000)
                });
                res.send("Login Successful");
            }
        else
        { 
            throw new Error("Invalid Credentials.");
        }


    }catch(err){
        res.status(400).send("ERROR :" + err.message);
    }

});

app.get("/profile",userAuth,async (req,res)=>{

    try{
        const user1 = req.user;
        res.send(user1);

    }catch(err)
    {
        res.status(400).send("ERROR :" + err.message);
    }
});

app.post("/sendConnectionRequest",userAuth,async (req,res)=>{
    const user = req.user;
    res.send(user.firstName + " sent a connection request...");
    console.log("Connection Request");
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
