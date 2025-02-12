const express = require("express");

const app = express();

app.use("/test",(req,res)=>
{
    res.send("This is test");
});

app.use("/hello",(req,res)=>{
    res.send("hello from the server");
});

app.listen(7777,()=>{
    console.log("server started listening on port 7777");
});