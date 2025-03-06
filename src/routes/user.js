const express = require('express');
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills about";
//Get all the pending connection Request for the loggedIn user
userRouter.get("/user/requests/received",userAuth, async (req,res) =>{

    try{       
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId",USER_SAFE_DATA);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    }catch(err)
    {
        res.statusCode(400).send("Error: " + err.message);
    }
});
userRouter.get("/user/connections",userAuth,async(req,res)=>{

    try{
        const loggedInUser = req.user;
        
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                    
                    {toUserId: loggedInUser._id, status: "acccepted"},
                    {fromUserId: loggedInUser._id, status: "accepted"},
            ],
        }).populate("fromUserId",USER_SAFE_DATA)
           .populate("toUserId",USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
               return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data });

    }catch(err)
    {
        res.status(400).send({ message: err.message});
    }
});



module.exports = userRouter;