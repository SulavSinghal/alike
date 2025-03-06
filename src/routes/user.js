const express = require('express');
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

//Get all the pending connection Request for the loggedIn user
userRouter.get("/user/requests/received",userAuth, async (req,res) =>{

    try{       
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId","firstName lastName photoUrl age gender skills about");

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    }catch(err)
    {
        res.statusCode(400).send("Error: " + err.message);
    }
});
module.exports = userRouter;