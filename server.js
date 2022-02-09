require("dotenv").config();

const path = require("path");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
//routing
const mainRouter = require("./routing/mainroutes.js");
const authRouter = require("./routing/authenticroutes");
//models
const MessageModel = require("./models/MessageModel");
const cookieParser = require("cookie-parser");
const { formatMessage } = require("./functionality/messaging");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./functionality/users");
//express
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.static("static"));
app.set("views", path.join(__dirname, "/static/"));
app.set("view engine", "ejs");
app.use(mainRouter);
app.use(authRouter);

//MongoDB connection 
const dbURI = "mongodb+srv://roberto:474220Abc@cluster0.isirs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

//connect to the db
mongoose
  .connect(dbURI)
  .then(() => console.log(`Database connection was a success`))
  .catch((err) => console.log(`Database connection error, something went wrong. ${err}`
));


const http = require("http").createServer(app);
const io = require("socket.io")(http);
io.on("connection", (socket) => {
    
    socket.on("joinRoom", ({ username, room }) => {
        const User = userJoin(socket.id, username, room);
        socket.join(User.room);
        let msg = `${User.username} has just entered the Chat, say hello!`;

        io.to(User.room).emit("message", formatMessage("ChatRoom", msg));
        io.to(User.room).emit("roomUsers", {
            room: User.room,
            users: getRoomUsers(User.room),
        });

        let message = new MessageModel({ from_user: "ChatRoom", room: User.room, message: msg, date_sent: new Date() });
        message.save();
    });

    
    socket.on("chatMessage", (msg) => {
        const User = getCurrentUser(socket.id);
        io.to(User.room).emit("message", formatMessage(User.username, msg));

        let message = new MessageModel({ from_user: User.username, room: User.room, message: msg, date_sent: new Date() });
        message.save();
    });

    
    socket.on("disconnect", () => {
        const User = userLeave(socket.id);
        let msg = `${User.username} has exited the Chat room`;
        io.to(User.room).emit("message", formatMessage("ChatRoom", msg));
        io.to(User.room).emit("roomUsers", {
            room: User.room,
            users: getRoomUsers(User.room),
        });

        let message = new MessageModel({ from_user: "Room", room: User.room, message: msg, date_sent: new Date() });
        message.save();
    });
});

//Start HTTP server
http.listen(process.env.PORT || 8080, () => {
    console.log("The server is now running successfully, PORT NUMBER: 8080");
});

