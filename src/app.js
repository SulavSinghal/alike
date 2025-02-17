const express = require("express");
const connectdb = require("./config/database");
const app = express();

connectdb()
.then(()=>{
    console.log("Database connected succesfully");
    app.listen(7777,()=>{
        console.log("Server is successfully listening on port 7777...")
    })
}).catch(err=>{
    console.error("Database connection cannot be established")    
});
