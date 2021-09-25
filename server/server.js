// Initialization of backend
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// Path to public folder
const publicPath = path.join(__dirname, '/../public');
// Port
const port = process.env.PORT || 3000;

// Initialization of Express.JS
let app = express();
let server = http.createServer(app);
// Initialization of Socket.IO Server
let io = socketIO(server);

// Let Express.JS know of public path
app.use(express.static(publicPath));

// Start server on port
server.listen(port, ()=> {
    console.log('Server is up on port ${port}.')
});

// Start Socket.IO connection with clients
io.on('connection', (socket) => {
    // Message on user join and exit
    console.log("A user just connected");
    socket.on('disconnect', () => {
        console.log("A user has disconnected");
    })

    // Action when client clicks startButton. Flow: Client Press -> Server Receive -> Server Response -> All Client Action
    socket.on('startGame', () => {
        io.emit('startGame');
    })

    // Action when client clicks RedSquare
    socket.on('crazyIsClicked', (data) => {
        io.emit('crazyIsClicked', data);
    });
});

