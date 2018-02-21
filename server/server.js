const express = require("express");
const http = require('http');
const bodyParser = require("body-parser");
const path = require("path");

var app = express();
var server = http.createServer(app);

const io = require('socket.io')(server);

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

app.use(bodyParser.json());
app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New User Connected!");
    
    socket.on('createMessage', (msg) => {
        console.log('New Message', msg);
        io.emit('newMessage', {
            from: msg.from,
            text: msg.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from server!");
    });
});

server.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});