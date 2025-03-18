const express = require("express");
const connectdb = require("./config/database");
const app = express();
const cors = require('cors');
const cookieparser = require("cookie-parser");
const http = require("http");

//using middlewares to convert json object to JS object
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));
app.use(express.json());
app.use(cookieparser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const RequestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket"); 
const  chatRouter  = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", RequestRouter);
app.use("/", userRouter);
app.use("/", chatRouter); 

const server = http.createServer(app);
initializeSocket(server);



connectdb()
.then(()=>{
    console.log("Database connected succesfully");
    server.listen(7777,()=>{
        console.log("Server is successfully listening on port 7777...");
    });
})
.catch(err=>{
    console.error("Database connection cannot be established");  
});
