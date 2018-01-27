const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
var { generateMessage, generateLocationMessage } = require('./utils/message');
var { isRealString } = require('./utils/validator');
var { Users } = require('./utils/users');

const port = process.env.PORT || 3000;
var app = express();
 //this is literally being created whenever we call app because that's how express was configured
var server = http.createServer(app);

var io = socketIO(server); //when you set up IO, you have an route that can accept the information and you also have access to javascript which is avaliable at: localhost:3000/socket.io/socket.io.js
var users = new Users();


////we are simply playing around with the event listeners to see what they exactly do
io.on('connection', (socket) => { //this socket represents the individual socket rather than all the sockets on the website
    console.log(`New user connected!`);


    //    socket.on('disconnect', () => {
    //        console.log("the client has disconnected! :( ");
    //    });

    //    socket.on('creatEmail', function (newEmail) {
    //        console.log('createEmail',newEmail);
    //    });
    //    socket.emit('newEmail', {
    //        from: 'mike@example.com',
    //        text: "HEY! I miss you, what's going on",
    //        createdAt: 123
    //    }); //by default we don't need to emit any data, the second argument is most commonly is your object that you want to sent
    //});


    // one massive difference between socket.emit and io.emit is that socket.emit does it to one connection while io emits it to EVERY single connection

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required!');
        }
        socket.join(params.room);
        users.removeUser(socket.id); //this is to ensure there is no user with the same id
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        //socket.leave() allows you to leave the room if you want

        //how have we emitted all the events so far:
            // io.emit - emits to every single user
            // socket.broadcast.emit - sends it to everyone connected to the socket server except current user
            // socket.emit - emits to specifically to one user
        // if we want to send it to a specific user = we user <socket>.<broadcast>.to('name').emit();
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });


   //adding acknowledgements!
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        };
        callback(); //we send data back by adding it in the callback 


        //in order to broadcast, lets look at what we have to do , 1) let the io know which individual socket we want to refrain emitting info to
        //its the same syntax, except that it will emit this event to everyone but the socket that the message emits from
        //socket.broadcast.emit('newMessage', {
        //    from: message.from,
        //    text: message.text,
        //    createdAt: new Date().getTime()
        //});
        
    });

    socket.on('createLocationMessage', (message) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, message.latitude, message.longitude));
        }
    });
    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));

        };
    });

});
//websockets are persistent networks - meaning that the client and the server keep the communication open as long as they want to

var publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));



server.listen(port, () => {
    console.log(`Listening on localhost:${port}`)
});

