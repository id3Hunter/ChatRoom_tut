const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when a client connects
io.on('connection', socket=>{
    socket.emit('message', 'Welcome to ChatCord'); //emits just to user

    //Broadcast when a user connects, emits to everyone except user
    socket.broadcast.emit('message', 'A user has joined the chat');

    //Broadcast message when a user disconnects
    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left the chat')
    });

    //Listen for a chatMessage & send it to every user
    socket.on('chatMessage', (msg)=>{
        io.emit('message', msg);
    })

});

const PORT =  process.env.PORT || 3000; // use environment variable 'PORT' or  use 3000

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));