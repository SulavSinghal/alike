//Aunthentication middlewares
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next) =>{
    //read the token from the req cookies
try{

    const cookies = req.cookies;
    const {token} = cookies;
    if(!token)
    {
        return res.status(401).send("Please Login!");
    }
    
    //validate the token
    const DecodedMessage = await jwt.verify(token, "SulaV123");
    const { _id } = DecodedMessage;

    
    //find the user
    const user = await User.findById(_id);
    if(!user)
    {
        throw new Error("User Not Found!");
    }
    req.user = user;
    next(); //will pass to request handler

}catch(err)
{
    res.status(400).send("ERROR: " + err.message);
}

};

module.exports = {
    userAuth,
};
