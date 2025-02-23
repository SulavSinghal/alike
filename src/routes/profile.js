const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile",userAuth,async (req,res)=>{

    try{
        const user1 = req.user;
        res.send(user1);

    }catch(err)
    {
        res.status(400).send("ERROR :" + err.message);
    }
});

//  profileRouter.patch("/profile/edit",userAuth,(req,res)=>{})
module.exports = profileRouter;