const mongoose = require('mongoose');
const User = require('./user');

const ConnectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //creating reference to user collection
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", //
        required: true,
    },
    status: {
        type: String,
        required: true, 
        enum: {
            values: ["ignored","interested","accepted","rejected"],
            message: `{VALUE} is incorrect status type`
        },
    },

},
 { timestamps: true });

 //ConnectionRequest.find({fromUserId: 35347434235}) it will execute very fast after adding compund index

 ConnectionRequestSchema.index({fromUserId: 1, toUserId: 1});

 //Middleware that will be called everytime we call connection request and it will save 
 ConnectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    //check if fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection Request to Yourself!");
    }
    next();
 })

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",ConnectionRequestSchema);

module.exports = ConnectionRequestModel;