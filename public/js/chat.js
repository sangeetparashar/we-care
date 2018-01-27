        var socket = io(); //this method is used to initiate the client connect to open up to the server . We need to store that in a variable
        function scrollToBottom() {
            //selectors
            var messages = jQuery('#messages');
            var newMessage = messages.children('li:last-child') //this lets you write a solution specific to the selector's children
            //heights
            var clientHeight = messages.prop('clientHeight');
            var scrollTop = messages.prop('scrollTop');
            var scrollHeight = messages.prop('scrollHeight');
            var newMessageHeight = newMessage.innerHeight();
            var lastMessageHeight = newMessage.prev().innerHeight(); //moves us to the previous child

            if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
                messages.scrollTop(scrollHeight);
            };

        };

        socket.on('connect', function () {
            console.log('Connected to server');
            var params = jQuery.deparam(window.location.search);
            socket.emit('join', params, function (error) {
                if (error) {
                    alert(error);
                    window.location.href = '/';
                } else {
                    console.log("no error");

                }
                });

            //    socket.emit('creatEmail', {
            //        to: 'shay@gmail.com',
            //        text: 'sangeet you mean the world to me, be my bf'

            //    });
            //});

            socket.on('disconnect', function () {
                console.log('Disconnected from the server');
            });

            socket.on('updateUserList', function (users) {
                var ol = jQuery('<ol></ol>');

                users.forEach(function (user) {
                    ol.append(jQuery('<li></li>').text(user));
                });

                jQuery('#users').html(ol);
            });


            //the term broadcasting is something we'll look into now... IT IS A WAY OF EMITTING AN EVENT TO EVERYONE EXCEPT ONE PERSON
        });
        socket.on('newMessage', function (message) {
            var formattedTime = moment(message.createdAt).format('h:mm a');
            var template = jQuery('#message-template').html();
            var html = Mustache.render(template, {
                text: message.text,
                from: message.from,
                createdAt: formattedTime
            });
            jQuery('#messages').append(html);
            scrollToBottom();

            //console.log(JSON.stringify(message, undefined, 2));

            //var li = jQuery('<li></li>');
            //li.text(`${message.from} [${formattedTime}]: ${message.text}`);

            //jQuery('#messages').append(li);
        
        });


socket.on('newLocationMessage', function (coords) {
    var formattedTime = moment(coords.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: coords.url,
        from: coords.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    //var li = jQuery('<li></li>');
    //var a = jQuery('<a target="_blank">My current location<\a>') //the _blank tag tells the browser to open the link in a new tab, not the current tab
    //li.text(`${coords.from} [${formattedTiem}]: `);
    //a.attr('href', coords.url); //you can add and fetch to jQuery
    //li.append(a);
    //jQuery('#messages').append(li);

});
//adding a third argument that is the acknowledgement!
        jQuery('#message-form').on('submit', function (e) {
            e.preventDefault();

            var messageTextbox = jQuery('[name=message]');
            socket.emit('createMessage', {
                text: messageTextbox.val()
            }, function () {
                messageTextbox.val('');
                });
        });
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    locationButton.attr('disabled', 'disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location');
        });
});

//socket.on('newEmail', function (result) { //the data that is emmitted is a data that can be the first argument in the callback
//    console.log("New email.", JSON.stringify(result, undefined, 2));
//});

