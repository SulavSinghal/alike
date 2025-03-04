const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");

profileRouter.get("/profile/view",userAuth,async (req,res)=>{

    try{
        const user1 = req.user;
        res.send(user1);

    }catch(err)
    {
        res.status(400).send("ERROR :" + err.message);
    }
});

 profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
 try{
    if(!validateEditProfileData(req)){
        throw new Error("Invalid Edit Request");
    }
    const LoggedInUser = req.user; 

    Object.keys(req.body).forEach((key) => (LoggedInUser[key] = req.body[key]));
    
    await LoggedInUser.save(); // for saving in database

    res.json({
        message: `${LoggedInUser.firstName}, your profile Updated Sucessfully!!`,
        data: LoggedInUser,
 });

 }catch(err)
 {
    res.status(400).send("Error: " + err.message);
 }
});

// profileRouter.patch("/profile/password",)
module.exports = profileRouter;