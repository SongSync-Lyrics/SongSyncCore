// Initialization of backend
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 80;

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

    socket.on('leaderJoin', (room) => {
        if (roomMap.has(room)) {
            io.to(socket.id).emit('roomAlreadyExists', room);
        } else {
            leaderJoinAction(room, socket);
        }
    })

    socket.on('followerJoin', (room) => {
        if (roomMap.has(room)) {
            followerJoinAction(room, socket);
        } else {
            io.to(socket.id).emit('roomNotFound', room);
        }
    })

    socket.on('displayLeaderLyrics', (room, song) => {
        let lyrics = chordProFormat(song['lyrics']);
        let title = song['title'];
        let artist = song['artist'];
        let posAndLeader = [lyrics, socket.id, title, artist];
        roomMap.set(room, posAndLeader);

        io.to(socket.id).emit('displayLyrics', lyrics, title, artist);
    });

    socket.on('displayFollowerLyrics', (room) => {
        let lyrics = roomMap.get(room)[0];
        let title = roomMap.get(room)[2];
        let artist = roomMap.get(room)[3];

        io.to(socket.id).emit('displayLyrics', lyrics, title, artist);
    });

    // vt is included to prevent wonky behavior
    socket.on('scroll', (room, visibleTables) => {
        let vt = visibleTables;
        io.to(room).emit('move', vt);
    });

    socket.on('getChordProFromUrl', async(url) => {
        let result = await getChordProFromUrl(url);

        io.to(socket.id).emit('parseSongFile', result);
    })
});

async function getChordProFromUrl(url) {
    try {
        const result = await axios.get(url)
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

    io.to(room).emit('leaderJoin', room);
    io.to(room).emit('startSession');
    io.to(room).emit('enableScroll');
}

function followerJoinAction(room, socket) {
    socket.join(room);
    io.to(socket.id).emit('followerJoin', room);
    io.to(socket.id).emit('startSession');
}

function chordProFormat(input) {
    const chordSheet = input;
    const parser = new ChordSheetJS.ChordProParser();
    const song = parser.parse(chordSheet);
    const formatter = new ChordSheetJS.HtmlTableFormatter();
    const disp = formatter.format(song);
    return disp;
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
}