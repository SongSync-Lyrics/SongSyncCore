// Initialization of backend
const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

// Path to public folder
const publicPath = path.join(__dirname, '/../public')
// Port
const port = process.env.PORT || 20411
const roomMap = new Map()

// Initialization of Express.JS
let app = express()
let server = http.createServer(app)
// Initialization of Socket.IO Server
let io = socketIO(server)

// Let Express.JS know of public path
app.use(express.static(publicPath))

// Start server on port
server.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})

// Start Socket.IO connection with clients
io.on('connection', (socket) => {
    function roomMapHasRoom(room) {
        return roomMap.has(room)
    }

    function isRoomEmpty(room) {
        const arr = Array.from(io.sockets.adapter.rooms)
        const filtered = arr.filter(room => !room[1].has(room[0]))
        // ==> ['room1', 'room2']
        const rooms = filtered.map(i => i[0])
        return !rooms.includes(room)
    }

    function removeEmptyRooms() {
        roomMap.forEach((values, key) => {
            if (isRoomEmpty(key)) {
                console.log("removeEmptyRooms| Empty Room Found " + key)
                roomMap.delete(key)
                console.log("removeEmptyRooms| Empty Room Removed " + key)
            }
        })
    }

    function isLeaderAction(socketid, room) {
        let leader = roomMap.get(room)[1]

        return leader == socketid
    }

    function checkLeaderDisconnect() {

        let leaderMissing = false;
        let rm;

        roomMap.forEach((roomInfo, room) => {
            if (isLeaderAction(socket.id, room)) {
                leaderMissing = true
                rm = room
            }
        })

        if (leaderMissing) {
            console.log("checkLeaderDisconnect| Leader Disconnected!")
            roomMap.delete(rm)
            console.log(roomMap)
            io.to(rm).emit('leaderDisconnect')
        }
    }

    function getActiveRooms(io) {
        // Convert map into 2D list:
        // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
        const arr = Array.from(io.sockets.adapter.rooms)

        // Filter rooms whose name exist in set:
        // ==> [['room1', Set(2)], ['room2', Set(2)]]
        const filtered = arr.filter(room => !room[1].has(room[0]))

        return filtered
    }

    // Message on user join and exit
    console.log("\nconnection| A user just connected")

    socket.on('disconnect', () => {
        console.log("\ndisconnect| A user has disconnected")
        checkLeaderDisconnect()
        removeEmptyRooms()
    })

    // Action when client clicks startButton. Flow: Client Press -> Server Receive -> Server Response -> All Client Action
    socket.on('startGame', (room) => {
        if (!roomMapHasRoom(room)) {
            console.log("\nstartGame| New Room Detected")
            let posAndLeader = [undefined, socket.id]
            roomMap.set(room, posAndLeader)
            socket.join(room)
            console.log("startGame| Leader " + socket.id + " joining room " + room)
            io.to(room).emit('startGame')
        } else {
            console.log("\nstartGame| Follower joining existing room")
            socket.join(room)
            console.log("startGame| Follower " + socket.id + " joining room " + room)
            io.to(room).emit('startGame')
            if (roomMap.get(room)[0] != undefined) {
                io.to(room).emit('crazyIsClicked', roomMap.get(room)[0])
            }
        }
    })

    // Action when client clicks RedSquare
    socket.on('crazyIsClicked', (data, room) => {
        let posAndLeader = roomMap.get(room)
        if (posAndLeader != undefined) {
            let leader = posAndLeader[1]
            posAndLeader = [data, leader]

            roomMap.set(room, posAndLeader)

            if (isLeaderAction(socket.id, room)) {
                console.log("\ncrazyIsClicked| Leader Action Accepted")
                io.to(room).emit('crazyIsClicked', data)
            } else {
                console.log("\ncrazyIsClicked| Not Leader, Action Rejected")
            }
        }

    })

    socket.on('listConnectedUsers', () => {
        console.log("\nlistConnectedUsers| User " + socket.id + " requested list of users")
        console.log("listConnectedUsers| List of users and rooms: ")

        console.log(getActiveRooms(io))
        console.log(roomMap)
    })

    socket.on('leaderStatus', (room) => {
        io.to(socket.id).emit('leaderStatus', isLeaderAction(socket.id, room))
    })

})


