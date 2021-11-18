// Initialization of backend
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const axios = require('axios');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 20411;

const ChordSheetJS = require('chordsheetjs').default;
const roomMap = new Map();

app.use(express.static(publicPath));
server.listen(port, () => {
    console.log('Server is up on port ' + port + '.');
});

// Start Socket.IO connection with clients
io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        removeLeaderIfDisconnected(socket.id);
        removeEmptyRooms();
    });

    // Action when client clicks startButton. Flow: Client Press -> Server Receive -> Server Response -> All Client Action
    socket.on('startGame', (room) => {
        if (!roomMapHasRoom(room)) {
            leaderJoinAction(room, socket);
        } else {
            followerJoinAction(room, socket);
        }
    });

    socket.on('displayLeaderLyrics', (room, song) => {
        let lyrics = chordProFormat(song['lyrics']);
        let posAndLeader = [lyrics, socket.id];
        roomMap.set(room, posAndLeader);
        io.to(room).emit('displayLyrics', lyrics);
    });

    socket.on('displayFollowerLyrics', (room) => {
        let lyrics = roomMap.get(room)[0];

        io.to(room).emit('displayLyrics', lyrics);
    });

    socket.on('getChordProFromUrl', async(url) => {
        console.log(url);
        let result = await getChordProFromUrl(url);
        // let blob = new Blob([result], { type: 'text/plain' });
        // let file = new File([blob], "song.txt", { type: "text/plain" });

        io.to(socket.id).emit('parseSongFile', result);
    })
});

async function getChordProFromUrl(url) {
    try {
        const result = await axios.get(url)
        console.log("result is = " + result.data);
        return result.data;
    } catch (err) {
        console.log('Error ' + err.statusCode);
        return undefined;
    };
}

function isLeaderAction(socketid, room) {
    let leader = roomMap.get(room)[1];

    return leader == socketid;
}

function isLeaderDisconnected(socketid) {
    let savedRoom;

    roomMap.forEach((roomInfo, room) => {
        if (isLeaderAction(socketid, room)) {
            savedRoom = room;
        }
    })

    return savedRoom;
}

function removeLeaderIfDisconnected(socketid) {
    let room = isLeaderDisconnected(socketid);

    if (room != undefined) {
        roomMap.delete(room);
    }
}

function isRoomEmpty(room) {
    const arr = Array.from(io.sockets.adapter.rooms);
    const filtered = arr.filter(room => !room[1].has(room[0]));
    // ==> ['room1', 'room2']
    const rooms = filtered.map(i => i[0]);
    return !rooms.includes(room);
}

function removeEmptyRooms() {
    roomMap.forEach((values, key) => {
        if (isRoomEmpty(key)) {
            roomMap.delete(key);
        }
    });
}

function roomMapHasRoom(room) {
    return roomMap.has(room);
}

function leaderJoinAction(room, socket) {
    let posAndLeader = [undefined, socket];
    roomMap.set(room, posAndLeader);

    socket.join(room);

    io.to(room).emit('startGame');
}

function followerJoinAction(room, socket) {
    socket.join(room);

    io.to(room).emit('startGame');
}

function chordProFormat(input) {
    const chordSheet = input;
    const parser = new ChordSheetJS.ChordProParser();
    const song = parser.parse(chordSheet);
    const formatter = new ChordSheetJS.HtmlTableFormatter();
    const disp = formatter.format(song);
    return disp;
}

function getActiveRooms(io) {
    // Convert map into 2D list:
    // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
    const arrayOfRoomObjects = Array.from(io.sockets.adapter.rooms);

    // Filter rooms whose name exist in set:
    // ==> [['room1', Set(2)], ['room2', Set(2)]]
    const filteredRooms = arrayOfRoomObjects.filter(room => !room[1].has(room[0]));

    return filteredRooms;
}

module.exports = {
    io,
    roomMap,
    isLeaderAction,
    isLeaderDisconnected,
    removeLeaderIfDisconnected,
    isRoomEmpty,
    removeEmptyRooms,
    roomMapHasRoom,
    getChordProFromUrl,
    chordProFormat,
    getActiveRooms
}