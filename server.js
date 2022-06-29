const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const ejs = require('ejs');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 8000;
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.redirect(`/${uuidv4()}`)
})

// specify url for peer server
app.use('/peerjs', peerServer);


app.get('/:room', (req,res) => {
    res.status(200).render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
       socket.join(roomId)
       socket.to(roomId).emit('user-connected', userId);

       socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId);
       })

       // listen and recieve message sent from other user and send back to same room
       socket.on('message', message => {
        console.log('this is another message 2', message)
        io.to(roomId).emit('createMessage', message)
      })
    })
})

server.listen(PORT, (req,res) => {
    console.log(`Server successfully connected to port ${PORT}`)
})