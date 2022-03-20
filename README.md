<img src="public/css/pictures/SongSync_Logo.png" width="512"> ©
_____

Share lyrics with friends. Featuring online rooms.

<img src="images/app.png" width="1024"> 


## Built upon on the following
[Link](https://devdojo.com/dennis/use-socketio-to-build-a-game)

### Using the following libraries

* Socket.io
* Socket.io-client
* Axios
* Express.js
* Node.js
* ChordSheetJs
* Mocha & Chai
* Http & Path
* Cucumber.io
* csv-parser

## License

SongSync is licensed under GNU LGPLv3, a free and open-source license. For more information, please see the
[license file](https://github.com/SongSync-Lyrics/SongSyncCore/blob/main/LICENSE.txt).

<br/>

# Documentation

## server.js

```js
socket.on('disconnect', () => {
        removeLeaderIfDisconnected(socket.id);
        removeEmptyRooms();
    });
```

> When a user disconnects, run the following code:`removeLeaderIfDisconnected()` & `removeEmptyRooms()`

<br/>

```js
socket.on('leaderJoin', (room) => {
        if (roomMap.has(room)) {
            io.to(socket.id).emit('roomAlreadyExists', room);
        } else {
            leaderJoinAction(room, socket);
        }
    })
```

> On `leaderJoin` event, check if `roomMap` has `room`. If `room` exists, send `roomAlreadyExists` event to client `socket.id`. Otherwise, run `leaderJoinAction()`.

<br/>

```js
socket.on('followerJoin', (room) => {
        if (roomMap.has(room)) {
            followerJoinAction(room, socket);
        } else {
            io.to(socket.id).emit('roomNotFound', room);
        }
    })
```

> On `followerJoin` event, check if `roomMap` has `room`. If `room` exists, run `followerJoinAction()`. Otherwise, send `roomNotFound` event to client `socket.id`. 

<br />

```js
socket.on('displayLeaderLyrics', (room, song) => {
    let lyrics = chordProFormat(song['lyrics']);
    let title = song['title'];
    let artist = song['artist'];
    let posAndLeader = [lyrics, socket.id, title, artist];
    roomMap.set(room, posAndLeader);

    io.to(socket.id).emit('displayLyrics', lyrics, title, artist);
});
```

> On `displayLeaderLyrics` event, retrieve `lyrics`, `title`, and `artist` from `song`. Add previous variables to the `posAndLeader` array. Set the value of the `room` key to `posAndLeader` in the `roomMap` Map.

<br />

```js
socket.on('displayFollowerLyrics', (room) => {
    let lyrics = roomMap.get(room)[0];
    let title = roomMap.get(room)[2];
    let artist = roomMap.get(room)[3];

    io.to(socket.id).emit('displayLyrics', lyrics, title, artist);
});
```

> On `displayFollowerLyrics` event, retrieve `lyrics`, `title`, and `artist` from `roomMap`. Emit `displayLyrics` event to client `socket.id`, passing on `lyrics`, `title`, and `artist`.

<br />

```js
socket.on('scroll', (room, visibleTables) => {
    let vt = visibleTables;
    io.to(room).emit('move', vt);
});
```

> On `scroll` event, emit `move` event to `room`, passing `vt`.

<br />

```js
socket.on('getChordProFromUrl', async(url) => {
    let result = await getChordProFromUrl(url);

    io.to(socket.id).emit('parseSongFile', result);
})
```

> On `getChordProFromUrl` event, retrieve `result` from function `getChordProFromUrl`. Emit `parseSongFile` event to client `socket.id`, passing `result`.

<br />

```js
async function getChordProFromUrl(url) {
    try {
        const result = await axios.get(url)
        return result.data;
    } catch (err) {
        console.log('Error ' + err.statusCode);
        return undefined;
    };
}
```

> Using the `axios` libary, download file from given `url`. Return the result. Catch any errors from invalid urls.

<br />

```js
function isLeaderAction(socketid, room) {
    let leader = roomMap.get(room)[1];

    return leader == socketid;
}
```

> Check if the given `socketid` is the leader of the given `room`

<br />

```js
function isLeaderDisconnected(socketid) {
    let savedRoom;

    roomMap.forEach((roomInfo, room) => {
        if (isLeaderAction(socketid, room)) {
            savedRoom = room;
        }
    })

    return savedRoom;
}
```

> Check if the given `socketid` is a leader of a `room`. Return found `room`. `room` is `undefined` if not found.

<br />

```js
function removeLeaderIfDisconnected(socketid) {
    let room = isLeaderDisconnected(socketid);

    if (room != undefined) {
        roomMap.delete(room);
    }
}
```

> Retrieve `room` from function `isLeaderDisconnected`. If the `room` exists, delete `room` from `roomMap`.

<br />

```js
function isRoomEmpty(room) {
    const arr = Array.from(io.sockets.adapter.rooms);
    const filtered = arr.filter(room => !room[1].has(room[0]));
    // ==> ['room1', 'room2']
    const rooms = filtered.map(i => i[0]);
    return !rooms.includes(room);
}
```

> Retrieve list of `rooms` currently instantiated in socket.io. If given `room` is no longer in current list of `rooms`, return `True`. Otherwise, `False`.

<br />

```js
function removeEmptyRooms() {
    roomMap.forEach((values, key) => {
        if (isRoomEmpty(key)) {
            roomMap.delete(key);
        }
    });
}
```

> Given rooms in `roomMap`, delete rooms that are empty from `roomMap`

<br />

```js
function roomMapHasRoom(room) {
    return roomMap.has(room);
}
```

> When function `roomMapHasRoom()` is called, check if given `room` has a corresponding key value in the `roomMap` Map. If the result is true, return `True`. Otherwise, the function will return a `False` result.

<br />

```js
function leaderJoinAction(room, socket) {
    let posAndLeader = [undefined, socket];
    roomMap.set(room, posAndLeader);

    socket.join(room);

    io.to(room).emit('leaderJoin', room);
    io.to(room).emit('startSession');
    io.to(room).emit('enableScroll');
}
```

> Save the current leader's `socket` id and `room` id to `roomMap`. Tell socket.io to create a new room. Then let the leader join said room. In the newly created `room`. Emit `leaderJoin`, `startSession`, and `enableScroll` to the client side.

<br />

```js
function followerJoinAction(room, socket) {
    socket.join(room);
    io.to(socket.id).emit('followerJoin', room);
    io.to(socket.id).emit('startSession');
}
```

> Let the follower join given 'room'. Emit `followerJoin`, and `startSession` to the client side.

<br />

```js
function chordProFormat(input) {
    const chordSheet = input;
    const parser = new ChordSheetJS.ChordProParser();
    const song = parser.parse(chordSheet);
    const formatter = new ChordSheetJS.HtmlTableFormatter();
    const disp = formatter.format(song);
    return disp;
}
```

> Using the `ChordSheetJs` library, format the given raw text `input` as an `html` element that will be sent client side

<br />

_____

<br />

## app.js

```js 
uploadButton.addEventListener('click', async () => {
    if (chordproFileInput != null || (chordproUrlInput != null)) {
        if (fileUpload) {
            console.log("file upload");
            parseChordProFile();
        } else {
            console.log("Url upload")
            await retrieveUrl();
        }
    }
})
```

>On click of `uploadButton` check if inputs are null then check if input is file upload or URL upload.  

<br />

```js 
chordproFileInput.addEventListener('change', () => {
    fileUpload = true;
})
```

>Add a change event listener to the `chordproFileInput` to check if the user is uploading a file and change `fileUpload` to true

<br />

```js
let acceptedExtensions = ['cho', 'crd', 'chopro', 'chord', 'pro'];

chordproFileInput.addEventListener('change', function () {
    let trueExtension = chordproFileInput.value.split('.').pop();
    if (!acceptedExtensions.includes(trueExtension)) {
        alert('Not a valid ChordPro File or you have pasted a URL');
        chordproFileInput.value = '';
        nextButton.setAttribute('disabled', 'disabled')

    } else if (chordproUrlInput.value !== '') {
        chordproUrlInput.value = '';
        alert('Please only select one option')

    } else {
        nextButton.removeAttribute("disabled")
    }

})
```

>Add a change event listener to the `chordproFileInput` that checks to see if the file extension matches the accepted chordpro file extensions in the `acceptedExtensions` list, which will enable the `nextButton`. 

>If the file does not contain the accepted extensions, an `alert()` will let the user know that the file is not valid. And if the user passes a value to `chordproUrlInput` at the same time, an `alert()` will let the user know that they can only select one option. 

<br />

```js
chordproUrlInput.addEventListener('input', function () {
    fileUpload = false;
    let trueExtension = chordproUrlInput.value.split('.').pop();
    let notValidUrlLabel = document.getElementById('notValidUrl');
    if (chordproFileInput.value != '') {
        alert('Please select one option');
        chordproFileInput.value = '';
    } else if (!acceptedExtensions.includes(trueExtension)) {
        notValidUrlLabel.style.display = 'block';
        nextButton.setAttribute('disabled', 'disabled');
    }
    else {
        notValidUrlLabel.style.display = 'none';
        nextButton.removeAttribute('disabled', 'disabled');
    }
})
```
>Add an input listener to `chordProUrlInput` that checks if the user is submitting a URL, first check to make sure the `chordproFileInput` field is empty and `alert()` the user if it is not.

>Check if the url the user entered is a valid url by making sure the extension matches one in the `acceptedExtensions` list, if the extension does not match set the button to disabled and display the `notValidUrlLabel` to the user.

<br />

```js
input.addEventListener('input', function () {
    startButton.removeAttribute('disabled');
    followerStartButton.removeAttribute('disabled');
})
```

>Add an input listener to `input` that enables the `startButton` and the `followerStartButton` when they type in a room code.

<br />

```js
async function retrieveUrl() {
    let url = chordproUrlInput.value;
    if (url.substring(url.includes(acceptedExtensions.values))) {
        await socket.emit('getChordProFromUrl', (url));
    } else {
        alert("This is not a valid ChordPro file");
        validFile = false;
        chordproUrlInput.value = '';
    }
}
```

>Retrieve the URL that the user entered and make sure the it is valid by checking the extension. If accepted, emit to the server the `getChordProFromUrl` event with the `url` as the argument.

<br />

```js
socket.on('parseSongFile', (chordProInput) => {
    let title = getTitle(chordProInput);
    let subtitle = getSubtitle(chordProInput);
    let artist = getArtist(chordProInput);
    let composer = getComposer(chordProInput);
    let lyricist = getLyricist(chordProInput);
    let copyright = getCopyright(chordProInput);
    let album = getAlbum(chordProInput);
    let year = getYear(chordProInput);
    let key = getKey(chordProInput);
    let time = getTime(chordProInput);
    let tempo = getTempo(chordProInput);
    let duration = getDuration(chordProInput);
    lyrics = getLyrics(chordProInput);

    song = {};
    song["title"] = title;
    song["subtitle"] = subtitle;
    song["artist"] = artist;
    song["composer"] = composer;
    song["lyricist"] = lyricist;
    song["copyright"] = copyright;
    song["album"] = album;
    song["year"] = year;
    song["key"] = key;
    song["time"] = time;
    song["tempo"] = tempo;
    song["duration"] = duration;
    song["lyrics"] = lyrics;

    validFile = true;
});
```

>When `parseSongFile` is emitted, a `song` object will be created from the `chordproInput`.>

<br />

```js
function parseChordProFile() {
    let fileName = chordproFileInput.files[0].name;
    if (fileName.substring(fileName.includes(acceptedExtensions.values))) {
        let fr = new FileReader();
        fr.onload = function () {
            let chordProInput = fr.result;
            let title = getTitle(chordProInput);
            let subtitle = getSubtitle(chordProInput);
            let artist = getArtist(chordProInput);
            let composer = getComposer(chordProInput);
            let lyricist = getLyricist(chordProInput);
            let copyright = getCopyright(chordProInput);
            let album = getAlbum(chordProInput);
            let year = getYear(chordProInput);
            let key = getKey(chordProInput);
            let time = getTime(chordProInput);
            let tempo = getTempo(chordProInput);
            let duration = getDuration(chordProInput);
            lyrics = getLyrics(chordProInput);

            song = {};
            song["title"] = title;
            song["subtitle"] = subtitle;
            song["artist"] = artist;
            song["composer"] = composer;
            song["lyricist"] = lyricist;
            song["copyright"] = copyright;
            song["album"] = album;
            song["year"] = year;
            song["key"] = key;
            song["time"] = time;
            song["tempo"] = tempo;
            song["duration"] = duration;
            song["lyrics"] = lyrics;
        }
        fr.readAsText(chordproFileInput.files[0]);
        validFile = true;
    } else {
        alert("This is not a valid ChordPro file");
        validFile = false;
        chordproFileInput.value = null;
    }
}

```

>Creates a `song` object from `chordproFileInput`.

<br />

```js
leaderCreateForm.addEventListener('submit', function (e) {
    e.preventDefault()
    if (!input.value) return;

    room = input.value
    if (song == undefined) return;

    socket.emit('leaderJoin', input.value)
});
```

>When the user submits the `form` to create the session, first prevent `form` submission. Check if `input` is null, return nothing if it is. 

>Check if `song` object is `undefined` return nothing if it is. Emit `leaderJoin` event to the server with `input` as the argument.

<br />

```js
socket.on('leaderJoin', (room) => {
    socket.emit('displayLeaderLyrics', room, song)
})
```

>On `leaderJoin` event emit `displayerLeaderLyrics` with `room` and `song`.

<br />

```js
followerCreateForm.addEventListener('submit', function (e) {
    e.preventDefault()
    room = input.value
    socket.emit('followerJoin', input.value)
});
```

>When the follower submits `followerCreateForm` to join a session, first prevent form submission. Emit `followerJoin` event to the server with `input`.

<br />

```js
socket.on('followerJoin', (room) => {
    socket.emit('displayLeaderLyrics', room, song)
})
```

>On the `followerJoin` event, emit `displayLeaderLyrics` to the server with `room` and `song`.

<br />

```js
socket.on('roomAlreadyExists', (room) => {
    if (alert("Room " + room + " already exists. Please try a different room id.")) { } else window.location.reload();
})
```

>On `roomAlreadyExists` check if the user's `input` matches a `room` that has already been made by another user. Tell the user and reload the page.

<br />

```js
socket.on('roomNotFound', (room) => {
    if (alert("Room " + room + " not found. Please try a different room id.")) { } else window.location.reload();
})
```

>Alerts the user that the room they've tried to join does not exist.

<br />

```js
function hideStartButton() {
    leaderCreateForm.style.display = "none"
}
```

>Hide start button until it is ready to be displayed.

<br />

```js
socket.on('startSession', () => {
    hideStartButton()
});
```

>On the `startSession` event run the `hideStartButton` function.

<br />

```js
socket.on('displayLyrics', (lyrics, title, artist) => {
    document.getElementById('screen').style.display = 'flex';
    document.getElementById('display').style.display = 'block';
    document.getElementById('song-info').style.display = 'flex';
    document.getElementById('display').innerHTML = lyrics;
    document.getElementById('session-name').innerHTML = "Session: " + room;
    document.getElementById('song-title').innerHTML = title;
    if (artist != 'Undefined') {
        document.getElementById('song-artist').innerHTML = "By " + artist;
    }
    //document.getElementById('song-title').innerHTML = song["title"];
    var elements = document.querySelectorAll('.row');
    for (let i = 0; i < elements.length; i++) {
        elements[i].id = i;
        visibleTables.push(0);
    }
    for (let i = 0; i < 4; i++) {
        visibleTables[i] = 1;
    }
    vtl = elements.length;
    displayTables();
});
```

>Displays the lyrics, session name, and song information.

```js
socket.on('enableScroll', () => {
    console.log('scroll enabled');
    document.addEventListener("keydown", keyDownScroll, false);
});
```

>On `enableScroll` event add `keydown` eventListener run `keyDownScroll`.

<br />

```js
socket.on('move', (vt) => {
    visibleTables = vt;
    visibleTables.length = vtl;
    displayTables();
})
```

>On the `move` event run `displayTables()`

<br />

```js
function displayTables() {
    console.log(visibleTables);
    for (let i = 0; i < visibleTables.length; i++) {
        if (visibleTables[i] == 0 && document.getElementById(i) != null) {
            document.getElementById(i).style.display = "none";
        } else if (visibleTables[i] == 1 && document.getElementById(i) != null) {
            document.getElementById(i).style.display = "block";
        }
    }
}
```

>Iterates through the `visibleTables` array and whether the index has a value of 1 (visible) or 0 (invisible) it will set `display` value of the corresponding html table row id to `none` or `block`. This is what scrolls the lyrics.

<br />

```js
function moveDown() {
    if (visibleTables[visibleTables.length - 1] != 1) {
        var temp = 0;
        for (let i = 0; i < visibleTables.length; i++) {
            if (visibleTables[i] == 1) {
                temp = i;
                break;
            }
        }
        visibleTables[temp] = 0;
        visibleTables[temp + 4] = 1;
    }
}
```

>Move the table down to display the next lyrics

<br />

```js
function moveUp() {
    if (visibleTables[0] != 1) {
        var temp = 0;
        for (let i = visibleTables.length - 1; i > 0; i--) {
            if (visibleTables[i] == 1) {
                temp = i;
                break;
            }
        }
        visibleTables[temp] = 0;
        visibleTables[temp - 4] = 1;
    }
}
```
>Move the table up to display the previous lyrics

<br />

```js
downArrow.addEventListener('click', function () {
    moveDown();
    socket.emit('scroll', room, visibleTables);
});
```

>When the `downArrow` is pressed, call `moveDown()` and emit `scroll` event with `room` and `visibleTables`.

<br />

```js
upArrow.addEventListener('click', function () {
    moveUp();
    socket.emit('scroll', room, visibleTables);
})
```

>When `upArrow` is pressed, call `moveUp()` and emit `scroll` event with `room` and `visibleTables`.

<br />

```js
function keyDownScroll(e) {
    //speed = document.getElementsByClassName('row')[0].clientHeight;
    console.log(visibleTables);
    var keyCode = e.keyCode;
    if (keyCode == 40 || keyCode == 34) {
        console.log("down");
        moveDown();
        socket.emit('scroll', room, visibleTables);
    } else if (keyCode == 38 || keyCode == 33) {
        console.log("up");
        moveUp();
        socket.emit('scroll', room, visibleTables);
    }
}
```

>Call the functions `moveDown()` or `moveUp()` and emit `scroll` event with `room` and `visibleTables` based on if the user pressed up, down, page up, or page down.

<br />

```js
function getLyrics(song) {
    let split = song.split('\n');
    let finalSong = "";
    for (let i = 0; i < split.length; i++) {
        if ((!(split[i].includes('{') || split[i].includes('/')))) {
            if (split[i].trim().length != 0) {
                finalSong += split[i] + "\n";
            }
        }
    }
    split = finalSong.split('\n');
    finalSong = "";
    for (let i = 0; i < split.length; i++) {
        if (!(split[i] == '')) {
            finalSong += split[i];
        }
    }
    return finalSong;
}
```

>Cleans up chordPro file and gets rid of all unecessary spaces.

<br />

```js
function getTitle(song) {
    let split = song.split('\n');
    let title = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{title:") || split[i].includes('{ title:') || split[i].includes('{t:') || split[i].includes('{ t:')) {
            title = split[i].replace("{title:", '');
            title = title.replace('{ title:', '');
            title = title.replace('{t:', '');
            title = title.replace('{ t:', '');
            title = title.replace('}', '');
            return title.trim();
        } else if (split[i].includes('{meta: title') || split[i].includes('{ meta: title') || split[i].includes('{meta: t') || split[i].includes('{ meta: t')) {
            title = split[i].replace('{meta: title', '');
            title = title.replace('{ meta: title', '');
            title = title.replace('{meta: t', '');
            chordproInput
            title = title.replace('{ meta: t', '');
            title = title.replace('}', '');
            return title.trim();
        }
    }
    return "Undefined";
}
```

>Gets title of the song.

<br />

```js
function getSubtitle(song) {
    let split = song.split('\n');
    let subtitle = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{subtitle:") || split[i].includes('{ subtitle:') || split[i].includes('{st:') || split[i].includes('{ st:')) {
            subtitle = split[i].replace("{subtitle:", '');
            subtitle = subtitle.replace('{ subtitle:', '');
            subtitle = subtitle.replace('{st:', '');
            subtitle = subtitle.replace('{ st:', '');
            subtitle = subtitle.replace('}', '');
            return subtitle.trim();
        } else if (split[i].includes('{meta: subtitle') || split[i].includes('{ meta: subtitle') || split[i].includes('{meta: st') || split[i].includes('{ meta: st')) {
            subtitle = split[i].replace('{meta: subtitle', '');
            subtitle = subtitle.replace('{ meta: subtitle', '');
            subtitle = subtitle.replace('{meta: st', '');
            subtitle = subtitle.replace('{ meta: st', '');
            subtitle = subtitle.replace('}', '');
            return subtitle.trim();
        }
    }
    return "Undefined";
}
```

>Gets subtitle of the song.

<br />

```js
function getArtist(song) {
    let split = song.split('\n');
    let artist = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{artist:") || split[i].includes('{ artist:') || split[i].includes('{a:') || split[i].includes('{ a:')) {
            artist = split[i].replace("{artist:", '');
            artist = artist.replace('{ artist:', '');
            artist = artist.replace('{a:', '');
            artist = artist.replace('{ a:', '');
            artist = artist.replace('}', '');
            return artist.trim();
        } else if (split[i].includes('{meta: artist') || split[i].includes('{ meta: artist') || split[i].includes('{meta: a') || split[i].includes('{ meta: a')) {
            artist = split[i].replace('{meta: artist', '');
            artist = artist.replace('{ meta: artist', '');
            artist = artist.replace('{meta: a', '');
            artist = artist.replace('{ meta: a', '');
            artist = artist.replace('}', '');
            return artist.trim();
        }
    }
    return "Undefined";
}
```

>Gets the artist of the song.

<br />

```js
function getComposer(song) {
    let split = song.split('\n');
    let composer = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{composer:") || split[i].includes('{ composer:')) {
            composer = split[i].replace("{composer:", '');
            composer = composer.replace('{ composer:', '');
            composer = composer.replace('}', '');
            return composer.trim();
        } else if (split[i].includes('{meta: composer') || split[i].includes('{ meta: composer')) {
            composer = split[i].replace('{meta: composer', '');
            composer = composer.replace('{ meta: composer', '');
            composer = composer.replace('}', '');
            return composer.trim();
        }
    }
    return "Undefined";
}
```

>Gets the composer of the song.

<br />

```js
function getLyricist(song) {
    let split = song.split('\n');
    let lyricist = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{lyricist:") || split[i].includes('{ lyricist:')) {

            lyricist = split[i].replace("{lyricist:", '');
            lyricist = lyricist.replace('{ lyricist:', '');
            lyricist = lyricist.replace('}', '');
            return lyricist.trim();
        } else if (split[i].includes('{meta: lyricist') || split[i].includes('{ meta: lyricist')) {

            lyricist = split[i].replace('{meta: lyricist', '');
            lyricist = lyricist.replace('{ meta: lyricist', '');
            lyricist = lyricist.replace('}', '');
            return lyricist.trim();
        }
    }
    return "Undefined";
}
```

>Gets the lyrcist of the song.

<br />

```js
function getCopyright(song) {
    let split = song.split('\n');
    let copyright = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{copyright:") || split[i].includes('{ copyright:')) {

            copyright = split[i].replace("{copyright:", '');
            copyright = copyright.replace('{ copyright:', '');
            copyright = copyright.replace('}', '');
            return copyright.trim();
        } else if (split[i].includes('{meta: copyright') || split[i].includes('{ meta: copyright')) {

            copyright = split[i].replace('{meta: copyright', '');
            copyright = copyright.replace('{ meta: copyright', '');
            copyright = copyright.replace('}', '');
            return copyright.trim();
        }
    }
    return "Undefined";
}
```

> Gets Copyright of `song`

<br />

```js
function getAlbum(song) {
    let split = song.split('\n');
    let album = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{album:") || split[i].includes('{ album:')) {

            album = split[i].replace("{album:", '');
            album = album.replace('{ album:', '');
            album = album.replace('}', '');
            return album.trim();
        } else if (split[i].includes('{meta: album') || split[i].includes('{ meta: album')) {

            album = split[i].replace('{meta: album', '');
            album = album.replace('{ meta: album', '');
            album = album.replace('}', '');
            return album.trim();
        }
    }
    return "Undefined";
}
```

> Gets Album of `song`

<br />

```js
function getYear(song) {
    let split = song.split('\n');
    let year = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{year:") || split[i].includes('{ year:') || split[i].includes('{y:') || split[i].includes('{ y:')) {

            year = split[i].replace("{year:", '');
            year = year.replace('{ year:', '');
            year = year.replace('{y:', '');
            year = year.replace('{ y:', '');
            year = year.replace('}', '');
            return year.trim();
        } else if (split[i].includes('{meta: year') || split[i].includes('{ meta: year') || split[i].includes('{meta: y') || split[i].includes('{ meta: y')) {

            year = split[i].replace('{meta: year', '');
            year = year.replace('{ meta: year', '');
            year = year.replace('{meta: y', '');
            year = year.replace('{ meta: y', '');
            year = year.replace('}', '');
            return year.trim();
        }
    }
    return "Undefined";
}
```

> Gets Year of `song`

<br />

```js
function getKey(song) {
    let split = song.split('\n');
    let key = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{key:") || split[i].includes('{ key:')) {

            key = split[i].replace("{key:", '');
            key = key.replace('{ key:', '');
            key = key.replace('}', '');
            return key.trim();
        } else if (split[i].includes('{meta: key') || split[i].includes('{ meta: key')) {

            key = split[i].replace('{meta: key', '');
            key = key.replace('{ meta: key', '');
            key = key.replace('}', '');
            return key.trim();
        }
    }
    return "Undefined";
```

> Gets Key of `song`

<br />

```js
function getTime(song) {
    let split = song.split('\n');
    let time = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{time:") || split[i].includes('{ time:')) {

            time = split[i].replace("{time:", '');
            time = time.replace('{ time:', '');
            time = time.replace('}', '');
            return time.trim();
        } else if (split[i].includes('{meta: time') || split[i].includes('{ meta: time')) {

            time = split[i].replace('{meta: time', '');
            time = time.replace('{ meta: time', '');
            time = time.replace('}', '');
            return time.trim();
        }
    }
    return "Undefined";
}
```

> Gets Time of `song`


<br />

```js
function getTempo(song) {
    let split = song.split('\n');
    let tempo = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{tempo:") || split[i].includes('{ tempo:')) {

            tempo = split[i].replace("{tempo:", '');
            tempo = tempo.replace('{ tempo:', '');
            tempo = tempo.replace('}', '');
            return tempo.trim();
        } else if (split[i].includes('{tempo: key') || split[i].includes('{ tempo: key')) {

            tempo = split[i].replace('{meta: tempo', '');
            tempo = tempo.replace('{ meta: tempo', '');
            tempo = tempo.replace('}', '');
            return tempo.trim();
        }
    }
    return "Undefined";
```

> Gets Tempo of `song`


<br />

```js
function getDuration(song) {
    let split = song.split('\n');
    let duration = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{duration:") || split[i].includes('{ duration:')) {

            duration = split[i].replace("{duration:", '');
            duration = duration.replace('{ duration:', '');
            duration = duration.replace('}', '');
            return duration.trim();
        } else if (split[i].includes('{meta: duration') || split[i].includes('{ meta: duration')) {

            duration = split[i].replace('{meta: duration', '');
            duration = duration.replace('{ meta: duration', '');
            duration = duration.replace('}', '');
            return duration.trim();
        }
    }
    return "Undefined";
}
```

> Gets Duration of `song`
