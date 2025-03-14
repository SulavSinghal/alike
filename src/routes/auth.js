const express = require('express');
const authRouter = express.Router();
const validator = require("validator");
const User = require('../models/user');
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");


authRouter.post("/signup",async (req,res)=>{//creating API for adding data in database
   

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
    
            const savedUser = await user.save();
            const token = await savedUser.getJWT();
            // Add the token to cookie and send the respond back
            res.cookie("token",token,{
                expires: new Date(Date.now() + 8 * 3600000)
            });
            res.json({message: "User added sucessfully!",data: savedUser}); // to save the data in database
        }catch(err){
            res.status(400).send("ERROR :" + err.message);
        }
    });

authRouter.post("/login",async (req,res)=>{
        try{
    
            const { emailId, password } = req.body;
            if(!validator.isEmail(emailId))
                {
                    throw new Error("Email is not valid!");
                }
    
            //extracting user info from database (User)
            const user = await User.findOne({emailId: emailId});
            
            if(!user){
                throw new Error ("Invalid!!");
            }
            const isPasswordValid = await user.validatePassword(password);
            if(isPasswordValid)
                {
                    const token = await user.getJWT();
                    // Add the token to cookie and send the respond back
                    res.cookie("token",token,{
                        expires: new Date(Date.now() + 8 * 3600000)
                    });
                    res.send(user);
                }
            else
            { 
                throw new Error("Invalid Credentials!");
            }
    
    
        }catch(err){
            res.status(400).send("ERROR :" + err.message);
        }
    
    });

authRouter.post("/logout",async (req,res)=>{ 
    res.cookie("token",null,{
        expires: new Date(Date.now())
    });
    res.send("Logout Sucessfull!");
});

module.exports = authRouter;