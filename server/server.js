const express = require("express");
const http = require('http');
const bodyParser = require("body-parser");
const path = require("path");

const {generateMessage, generateLocationMessage} = require("./utils/message");
const {isRealString} = require('./utils/validator');
const {Users} = require('./utils/users');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var users = new Users();

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

app.use(bodyParser.json());
app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New User Connected!");
    
    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
    // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined!'));

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required!');
        } 

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined!`));


        callback();
    });

    socket.on('createMessage', (msg, callback) => {
        var user = users.getUser(socket.id);

        if(user && isRealString(msg.text)) { 
            io.to(user[0].room).emit('newMessage', generateMessage(user[0].name, msg.text));
        }

        callback('This is from the server');
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if(user) {
            io.to(user[0].room).emit('newLocationMessage', generateLocationMessage(user[0].name, coords.latitude, coords.longitude));
        }
    });

    socket.on("disconnect", () => {
        var user = users.removeUser(socket.id);
        
        if(user) {
            io.to(user[0].room).emit('updateUserList', users.getUserList(user[0].room));
            io.to(user[0].room).emit('newMessage', generateMessage('Admin', user[0].name + ' has left.'));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});