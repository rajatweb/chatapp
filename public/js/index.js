var socket = io();

socket.on('connect', function() {
    console.log('Connected to server!');
});

socket.on('newMessage', function(message) {
    var formatedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formatedTime}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
    var formatedTime = moment(message.createdAt).format('h:mm a');

    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');

    li.text(`${message.from} ${formatedTime}: `);
    a.attr('href', message.url);

    li.append(a);
    jQuery('#messages').append(li);
});

socket.on('disconnect', function() {
    console.log('Disconnected from server!');
});

jQuery('#message-form').on("submit", function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery("[name=message]").val()
    }, function() {
        
    });
});


var locationButton = jQuery("#send-location");
locationButton.on("click", function(){
    if(!navigator.geolocation) {
        return alert("Geolocation not supported by browser!");
    }

    locationButton.attr('disabled', 'disabled').text('Sending location ...');

    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        locationButton.removeAttr('disabled').text('Send Location');
        alert("Unable to fetch location!");
   });
});