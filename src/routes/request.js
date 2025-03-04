const express = require('express');
const RequestRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

RequestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
  
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;  
        const status = req.params.status;

        //Validation of status
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid Status type " + status});
        }



        //If user exists in the database
        const toUser = await User.findById(toUserId);
        if(!toUser)
        {
            return res.status(404).json({message: "User doesnot Exists!"})
        }

        //If there is an existing ConnectionRequest
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:  [
                { fromUserId,toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if(existingConnectionRequest)
        {
            return res.status(400).json({message: "Connection Request Already Exists"});
        }
        const connectionRequest = new ConnectionRequest({
          fromUserId,
          toUserId,
          status,

        });

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName +" is " + status + " in  " + toUser.firstName,
            data,
        });

    } catch(err){
        res.status(400).send("Error: " + err.message);
    }
});




module.exports = RequestRouter;