// Initialization of backend
const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const publicPath = path.join(__dirname, '/../public')
const port = process.env.PORT || 20411

const ChordSheetJS = require('chordsheetjs').default;
const roomMap = new Map()

app.use(express.static(publicPath))
server.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})

// Start Socket.IO connection with clients
io.on('connection', (socket) => {

    // Message on user join and exit
    console.log("\nconnection| A user just connected")
    io.to(socket.id).emit('clearForm')

    function isLeaderAction(socketid, room) {
        let leader = roomMap.get(room)[1]

        return leader == socketid
    }

    function removeEmptyRooms() {
        roomMap.forEach((values, key) => {
            if (isRoomEmpty(key)) {
                console.log("removeEmptyRooms| Empty Room Found " + key)
                roomMap.delete(key)
            }
        })
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
            console.log("checkLeaderDisconnect| Leader Disconnected! Room deleted")
            roomMap.delete(rm)
        }
    }

    function isRoomEmpty(room) {
        const arr = Array.from(io.sockets.adapter.rooms)
        const filtered = arr.filter(room => !room[1].has(room[0]))
        // ==> ['room1', 'room2']
        const rooms = filtered.map(i => i[0])
        return !rooms.includes(room)
    }

    socket.on('disconnect', () => {
        console.log("\ndisconnect| A user has disconnected")
        checkLeaderDisconnect()
        removeEmptyRooms()
    })

    function roomMapHasRoom(room) {
        return roomMap.has(room)
    }

    function chordproFormat(input) {
        const chordSheet = input;
        const parser = new ChordSheetJS.ChordProParser();
        const song = parser.parse(chordSheet);
        const formatter = new ChordSheetJS.HtmlTableFormatter();
        const disp = formatter.format(song);
        return disp;
    }

    // Action when client clicks startButton. Flow: Client Press -> Server Receive -> Server Response -> All Client Action
    socket.on('startGame', (room) => {
        if (!roomMapHasRoom(room)) {
            let posAndLeader = [undefined, socket.id]
            roomMap.set(room, posAndLeader)

            socket.join(room)
            console.log("startGame| Leader " + socket.id + " joining room " + room)

            io.to(room).emit('startGame')
        } else {
            socket.join(room)

            console.log("startGame| Follower " + socket.id + " joining room " + room)

            io.to(room).emit('startGame')
        }
    })

    socket.on('displayLeaderLyrics', (room, song) => {
        let lyrics = chordproFormat(song['lyrics']);
        let posAndLeader = [lyrics, socket.id]
        roomMap.set(room, posAndLeader)

        io.to(room).emit('displayLyrics', lyrics);     
    })

    socket.on('displayFollowerLyrics', (room) => {
        let lyrics = roomMap.get(room)[0];

        io.to(room).emit('displayLyrics', lyrics);     
    })

    function getActiveRooms(io) {
        // Convert map into 2D list:
        // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
        const arr = Array.from(io.sockets.adapter.rooms)

        // Filter rooms whose name exist in set:
        // ==> [['room1', Set(2)], ['room2', Set(2)]]
        const filtered = arr.filter(room => !room[1].has(room[0]))

        return filtered
    }

    socket.on('listConnectedUsers', () => {
        console.log("\nlistConnectedUsers| List of users and rooms: ")
        console.log(getActiveRooms(io))
    })

})