const Client = require("socket.io-client");
const assert = require("chai").assert;

const app = require("../server/server");

const ChordSheetJS = require('chordsheetjs').default;

function chordProFormat(input) {
    const chordSheet = input;
    const parser = new ChordSheetJS.ChordProParser();
    const song = parser.parse(chordSheet);
    const formatter = new ChordSheetJS.HtmlTableFormatter();
    const disp = formatter.format(song);
    return disp;
}

describe("SongSync-Core Unit tests", () => {
    let io, serverSocket, clientSocket1;

    before((done) => {
        io = app.io;
        clientSocket1 = new Client(`http://localhost:20411`);
        io.on("connection", (socket) => {
            serverSocket = socket;
        });
        clientSocket1.on("connect", done);
    });

    after(() => {
        io.close();
        clientSocket1.close();
    });

    step("should pass", (done) => {
        clientSocket1.on("hello", (arg) => {
            assert.equal(arg, "world");
            done();
        });
        serverSocket.emit("hello", "world");
    });

    step("should join room 420", (done) => {
        serverSocket.on('startGame', (arg) => {
            let rooms = serverSocket.rooms.values();
            rooms.next();
            assert.equal(arg, '420');
            done();
        });
        clientSocket1.emit('startGame', '420');
    });

    step("should display lyrics", (done) => {
        clientSocket1.on('displayLyrics', (lyrics) => {
            let expected = '<div class="chord-sheet"><div class="paragraph"><table class="row"><tr><td class="chord"></td><td class="chord">G</td><td class="chord">D</td></tr><tr><td class="lyrics">It&#x27;s </td><td class="lyrics"> nine o&#x27;</td><td class="lyrics">clock</td></tr></table></div></div>'
            assert.equal(expected, lyrics)
            done();
        });
        let room = '420';

        let song = {};

        song['lyrics'] = "It's [G] nine o'[D]clock";


        clientSocket1.emit('displayLeaderLyrics', room, song);
    })

    // Contains disconnect function. Should always be last
    step("should remove empty rooms", (done) => {
        serverSocket.on('disconnect', () => {
            assert.equal(0, app.roomMap.size);
            done();
        });
        clientSocket1.emit('startGame', '420');
        clientSocket1.disconnect();
    })

    // End of SOCKET.IO Tests
    // BEGINNING OF UNIT TESTS

    step("should accept leader action", (done) => {
        app.roomMap.set('420', [undefined, '1234']);
        let socketid = '1234';
        let room = '420';

        assert.isTrue(app.isLeaderAction(socketid, room));
        done();
    })

    step("should decline follower action", (done) => {
        app.roomMap.set('420', [undefined, '1234']);
        let socketid = '12';
        let room = '420';

        assert.isFalse(app.isLeaderAction(socketid, room));
        done();
    })

    step("should return a room for leader is disconnected", (done) => {
        app.roomMap.set('420', [undefined, '1234']);
        let socketid = '1234';

        assert.equal('420', app.isLeaderDisconnected(socketid));
        done();
    })

    step("should not return a room for leader is connected", (done) => {
        app.roomMap.set('420', [undefined, '1234']);
        let socketid = '12';

        assert.notEqual('420', app.isLeaderDisconnected(socketid));
        done();
    })

    step("should delete room when leader disconnects", (done) => {
        app.roomMap.set('420', [undefined, '1234']);
        let socketid = '1234';

        app.removeLeaderIfDisconnected(socketid);

        assert.equal(0, app.roomMap.size);
        done();
    })

    step("should not delete room when leader does not disconnect", (done) => {
        app.roomMap.set('420', [undefined, '1234']);
        let socketid = '12';

        app.removeLeaderIfDisconnected(socketid);

        assert.equal(1, app.roomMap.size);
        done();
    })

    step("should return true for room existing", (done) => {
        app.roomMap.set('420', [undefined, '1234']);
        let room = '420';

        assert.isTrue(app.roomMapHasRoom(room));
        done();
    })

    step("should return false for room not existing", (done) => {
        app.roomMap.set('420', [undefined, '1234']);
        let room = '40';

        assert.isFalse(app.roomMapHasRoom(room));
        done();
    })

    step("should return lyrics", (done) => {
        let song = {};

        song['lyrics'] = "It's [G] nine o'[D]clock";

        let lyrics = app.chordProFormat(song['lyrics']);

        let expected = '<div class="chord-sheet"><div class="paragraph"><table class="row"><tr><td class="chord"></td><td class="chord">G</td><td class="chord">D</td></tr><tr><td class="lyrics">It&#x27;s </td><td class="lyrics"> nine o&#x27;</td><td class="lyrics">clock</td></tr></table></div></div>'

        assert.equal(expected, lyrics);
        done();
    })

    step("should download from url", async(done) => {
        let url = "https://www.google.com/";

        let result = await app.getChordProFromUrl(url);

        assert.isNotEmpty(result);
        done();
    })

});