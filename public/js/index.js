var socket = io();

socket.on('connect', function() {
    console.log('Connected to server!');
});

socket.on('newMessage', function(newMsg) {
    console.log('New Message', newMsg)
});

socket.on('disconnect', function() {
    console.log('Disconnected from server!');
});

