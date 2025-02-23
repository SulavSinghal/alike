const express = require('express');
const RequestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

RequestRouter.post("/sendConnectionRequest",userAuth,async (req,res)=>{
    const user = req.user;
    res.send(user.firstName + " sent a connection request...");
    console.log("Connection Request");
});



module.exports = RequestRouter;