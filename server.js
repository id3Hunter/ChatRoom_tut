const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoins, getCurrentUser, userLeaves, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

//Run when a client connects
io.on('connection', socket=>{

    socket.on('joinRoom', ({username, room}) =>{
        const user = userJoins(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessage(botName,`Welcome to ChatCord ${user.username}`)); //emits just to user

        //Broadcast when a user connects, emits to everyone except user
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        //Send user and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });
      
    //Listen for a chatMessage & send it to every user
    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username,msg));
    })

    //Broadcast message when a user disconnects
    socket.on('disconnect', ()=>{
        const user = userLeaves(socket.id);

        if(user){
            io.to(user.room).emit(
                'message', 
                formatMessage(botName, `${user.username} has left the chat`)
            );

             //Send user and room info
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            });

        }
        
    });

});

const PORT =  process.env.PORT || 3000; // use environment variable 'PORT' or  use 3000

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));