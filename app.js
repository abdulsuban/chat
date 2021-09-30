const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const http = require("http").Server(app);
const io = require("socket.io");

const port = 5000;
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));
socket = io(http);
const Chat = require("./models/Chat");
const connect = require("./dbconnect");

socket.on("connection", socket => {
    console.log("user connected");

    socket.on("disconnect", function() {
        console.log("user disconnected");
    });

    socket.on("typing", data => {
        socket.broadcast.emit("notifyTyping", {
            user: data.user,
            message: data.message
        });
    });

    socket.on("stopTyping", () => {
        socket.broadcast.emit("notifyStopTyping");
    });

    socket.on("chat message", function(msg) {
        console.log("message: " + msg);

        socket.broadcast.emit("received", { message: msg });

        connect.then(db => {
            console.log("connected correctly to the server");
            let chatMessage = new Chat({ message: msg, sender: "Anonymous" });

            chatMessage.save();
        });
    });
});

http.listen(port, () => {
    console.log("Running on Port: " + port);
});