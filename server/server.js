// Initialization of backend
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const axios = require('axios');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require('csv-parser');
const fs = require('fs');
const ArrayKeyedMap = require('array-keyed-map');
const nodemailer = require('nodemailer');
const cron = require('cron').CronJob;
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8080;

const ChordSheetJS = require('chordsheetjs').default;
const roomMap = new Map();
const songMap = new ArrayKeyedMap();
const filePath = 'csv/songs.csv';
const date = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

app.use(express.static(publicPath));
server.listen(port, () => {
    console.log('Server is up on port ' + port + '.');
});

readFromCsv();

const job = new cron('0 0 * * THU', function() {
    console.log("Running scheduled task");
    sendEmail().catch(console.error);
}, null, true, 'America/Indianapolis');
job.start();

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

        checkSongOnCsv(title, artist, song['lyricist'], song['composer']);

        io.to(socket.id).emit('displayLyrics', lyrics, title, artist);
    });

    socket.on('displayFollowerLyrics', (room) => {
        let lyrics = roomMap.get(room)[0];
        let title = roomMap.get(room)[2];
        let artist = roomMap.get(room)[3];

        io.to(socket.id).emit('displayLyrics', lyrics, title, artist);
    });

    socket.on('displayNextLyrics', (room, song) => {
        let lyrics = chordProFormat(song['lyrics']);
        let title = song['title'];
        let artist = song['artist'];
        let posAndLeader = [lyrics, socket.id, title, artist];
        roomMap.set(room, posAndLeader);

        checkSongOnCsv(title, artist, song['lyricist'], song['composer']);

        io.to(room).emit('displayLyrics', lyrics, title, artist);
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

async function sendEmail() {
    let transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net", // hostname
        port: 587, // port for secure SMTP
        auth: {
            user: "apikey",
            pass: process.env.SENDGRID_API_KEY
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"SongSync App" <songsyncapp@songsync.org>', // sender address
        to: "songsyncapp@gmail.com, luvlythinking@gmail.com", // list of receivers
        subject: "SongSync CSV", // Subject line
        text: "This is an automated message containing a list of songs played through SongSync", // plain text body
        attachments: [{
                filename: 'SongSync_SongsList.csv',
                path: filePath,
            }] // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou..
}

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
        saveSongMapToCsv();
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

function saveSongMapToCsv() {
    try {
        fs.unlinkSync(filePath);
        const songMapToCsv = csvWriter({
            path: filePath,
            header: [
                { id: 'title', title: 'title' },
                { id: 'artist', title: 'artist' },
                { id: 'lyricist', title: 'lyricist' },
                { id: 'composer', title: 'composer' },
                { id: 'count', title: 'count' },
                { id: 'month', title: 'month' },
                { id: 'year', title: 'year' }
            ]
        });

        const data = [];
        for (let [key, value] of songMap) {
            let title = key[0];
            let artist = key[1];
            let lyricist = key[2];
            let composer = key[3];
            let count = value[0];
            let month = value[1];
            let year = value[2];
            data.push({ title: title, artist: artist, lyricist: lyricist, composer: composer, count: count, month: month, year: year })
        }

        songMapToCsv
            .writeRecords(data)
            .then(() => console.log('The CSV file was written successfully'));
    } catch (err) {
        console.error(err);
    }
}

function readFromCsv() {
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            let title = row['title'];
            let artist = row['artist'];
            let lyricist = row['lyricist'];
            let composer = row['composer'];
            let count = Number(row['count']);
            let month = row['month'];
            let year = row['year'];

            if (title != undefined) {
                let songKey = [title, artist, lyricist, composer];
                let songValue = [count, month, year]
                songMap.set(songKey, songValue)
            }
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            console.log(songMap);
        });

}

function updateSongMap(songMapKey) {
    console.log("updating songmap")
    let songMapValue = songMap.get(songMapKey);
    songMapValue[0] = songMapValue[0] + 1;
    songMap.delete(songMapKey);
    songMap.set(songMapKey, songMapValue);
    console.log(songMap);
}


function addSongMapEntry(songMapKey) {
    console.log("adding song to songmap")
    let month = monthNames[date.getMonth()];
    let year = date.getFullYear();
    let songMapValue = [1, month, year]
    songMap.set(songMapKey, songMapValue);
    console.log(songMap);
}

function scanSongMap(title, artist, lyricist, composer) {
    console.log("scanning")
    for (let [key, value] of songMap) {
        let existingTitle = key[0];
        let existingArtist = key[1];
        let existingLyricist = key[2];
        let existingComposer = key[3];
        if (existingTitle == title && existingArtist == artist && existingLyricist == lyricist && existingComposer == composer) {
            return true;
        }
    }
    return false;
}


function checkSongOnCsv(title, artist, lyricist, composer) {
    console.log("checking song on csv")
    let newSongEntry = [title, artist, lyricist, composer]
    if (songMap.has(newSongEntry)) {
        updateSongMap(newSongEntry);
    } else if (!(scanSongMap(title, artist, lyricist, composer))) {
        addSongMapEntry(newSongEntry);
    }
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