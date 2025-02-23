const express = require("express");
const connectdb = require("./config/database");
const app = express();
//
const cookieparser = require("cookie-parser");
// const jwt = require("jsonwebtoken");


//using middlewares to convert json object to JS object
app.use(express.json());
app.use(cookieparser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const RequestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", RequestRouter);


connectdb()
.then(()=>{
    console.log("Database connected succesfully");
    app.listen(7777,()=>{
        console.log("Server is successfully listening on port 7777...");
    });
})
.catch(err=>{
    console.error("Database connection cannot be established");  
});
