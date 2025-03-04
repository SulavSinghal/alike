const express = require('express');
const RequestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

RequestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
  
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;  
        const status = req.params.status;

        const connectionRequest = new ConnectionRequest({
          fromUserId,
          toUserId,
          status,

        });

        const data = await connectionRequest.save();

        res.json({
            message: "Connection Request Sent Successfully!",
            data,
        });

    } catch(err){
        res.status(400).send("Error: " + err.message);
    }
});




module.exports = RequestRouter;