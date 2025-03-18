const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const onlineUsers = new Map();

const getSecretRoomId = (userId,targetUserId) => {
    return  crypto.createHash("sha256").update([userId,targetUserId].sort().join("_")).digest("hex");
}
const initializeSocket = (server) =>{
const io = socket(server,{
    cors: {
        origin: "http://localhost:5173",
    },
});

io.on("connection",(socket) => { //socket creation
    //handle events
    socket.on("joinChat",async ({firstName,userId,targetUserId}) => {
        const roomId = getSecretRoomId(userId,targetUserId);

        

            // check if users are friends
        const connection = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
            ],
        });

        if (!connection) {
            socket.emit("error", { message: "Unauthorized: Friendship not accepted." });
            return;
        }
        socket.join(roomId);

    });

        socket.on("sendMessage", 
            async ({firstName,userId,targetUserId,text }) => {
        

        //save messages to database
        try{
            const roomId = getSecretRoomId(userId,targetUserId);


            //verify connection
            const connection = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                    { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
                ],
            });

            if (!connection) {
                socket.emit("error", { message: "Unauthorized: Friendship not accepted." });
                return;
            }

            //fetch or create chat
            let chat = await  Chat.findOne({
                participants: {$all: [userId, targetUserId] },
            });
            if(!chat){
                chat = new Chat({
                    participants: [userId,targetUserId],
                    messages: [],
                });
            }
            //save message
            chat.messages.push({
                senderId: userId,
                text,
            });
            await chat.save();
            io.to(roomId).emit("messageReceived",{firstName,text});
        }catch(err){
            console.error(err);
        }
    });
 
    socket.on("disconnect", ()=>{
         
        console.log("User Disconnected");
    });
});
};

module.exports=initializeSocket;