// Initialize Socket.IO
let socket = io()
let room

// References to HTML file
//const startingSection = document.querySelector('.starting-section')
const homeBtn = document.querySelector('.home-btn')

let form = document.getElementById('form')
let input = document.getElementById('input')
let inputcp = document.getElementById('chordproInput')
let song

document.getElementById('chordproInput')
    .addEventListener('change', function () {
        let fr = new FileReader();
        fr.onload = function () {
            //console.log(inputcp)
            inputcp = fr.result;
            let title = getTitle(inputcp);
            let subtitle = getSubtitle(inputcp);
            let artist = getArtist(inputcp);
            let composer = getComposer(inputcp);
            let lyricist = getLyricist(inputcp);
            let copyright = getCopyright(inputcp);
            let album = getAlbum(inputcp);
            let year = getYear(inputcp);
            let key = getKey(inputcp);
            let time = getTime(inputcp);
            let tempo = getTempo(inputcp);
            let duration = getDuration(inputcp);
            lyrics = getLyrics(inputcp);

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
        fr.readAsText(this.files[0]);
    });

// When startButton is clicked, send response to server
//startButton.addEventListener('click', () => {
form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (input.value) {
        room = input.value

        if (song != undefined){
            console.log("ChordPro File found")
            socket.emit('startGame', input.value)
            socket.emit('displayLeaderLyrics', input.value, song)
        } else{
            console.log("Running follower code")
            socket.emit('startGame', input.value)
            socket.emit('displayFollowerLyrics', input.value)
        }
        
        console.log("Joining room: " + input.value)
    }
})

homeBtn.addEventListener('click', () => {
    socket.emit('listConnectedUsers')
})

function clearForms() {
    input.value = ''
    inputcp.value = ''
}

// Function that hides startButton, displays redSquare
function hideStartButton() {
    clearForms()
    form.style.display = "none"
}

socket.on('clearForm', () => {
    clearForms()
})

// When socket.io receives 'startGame' response from server, run hideStartButton
socket.on('startGame', () => {
    hideStartButton()
})

socket.on('displayLyrics', (lyrics) => {
    document.getElementById('display').innerHTML = lyrics;
})

//CHORDPRO STUFF
function formatLine(line) {
    const chordSheet = line.substring(1);
    const parser = new ChordSheetJS.ChordProParser();
    const song = parser.parse(chordSheet);
    const formatter = new ChordSheetJS.HtmlTableFormatter();
    const disp = formatter.format(song);
    return disp;
}

function getLyrics(song) {
    let split = song.split('\n');
    let finalSong = "";
    for (let i = 0; i < split.length; i++) {
        if ((!(split[i].includes('{') || split[i].includes('/')))) {
            finalSong += split[i] + "\n";
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

//GETTERS FOR CHORDPRO ATTRIBUTES
//Gets Title of Song
function getTitle(song) {
    let split = song.split('\n');
    let title = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{title:") || split[i].includes('{ title:') || split[i].includes('{t:') || split[i].includes('{ t:')) {
            //console.log(split[i]);
            title = split[i].replace("{title:", '');
            title = title.replace('{ title:', '');
            title = title.replace('{t:', '');
            title = title.replace('{ t:', '');
            title = title.replace('}', '');
            return title.trim();
        } else if (split[i].includes('{meta: title') || split[i].includes('{ meta: title') || split[i].includes('{meta: t') || split[i].includes('{ meta: t')) {
            //console.log(split[i]);
            title = split[i].replace('{meta: title', '');
            title = title.replace('{ meta: title', '');
            title = title.replace('{meta: t', '');
            title = title.replace('{ meta: t', '');
            title = title.replace('}', '');
            return title.trim();
        }
    }
    return "Undefined";
}
//Gets Subtitle of Song
function getSubtitle(song) {
    let split = song.split('\n');
    let subtitle = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{subtitle:") || split[i].includes('{ subtitle:') || split[i].includes('{st:') || split[i].includes('{ st:')) {
            //console.log(split[i]);
            subtitle = split[i].replace("{subtitle:", '');
            subtitle = subtitle.replace('{ subtitle:', '');
            subtitle = subtitle.replace('{st:', '');
            subtitle = subtitle.replace('{ st:', '');
            subtitle = subtitle.replace('}', '');
            return subtitle.trim();
        } else if (split[i].includes('{meta: subtitle') || split[i].includes('{ meta: subtitle') || split[i].includes('{meta: st') || split[i].includes('{ meta: st')) {
            //console.log(split[i]);
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
//Gets Artist of Song
function getArtist(song) {
    let split = song.split('\n');
    let artist = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{artist:") || split[i].includes('{ artist:') || split[i].includes('{a:') || split[i].includes('{ a:')) {
            //console.log(split[i]);
            artist = split[i].replace("{artist:", '');
            artist = artist.replace('{ artist:', '');
            artist = artist.replace('{a:', '');
            artist = artist.replace('{ a:', '');
            artist = artist.replace('}', '');
            return artist.trim();
        } else if (split[i].includes('{meta: artist') || split[i].includes('{ meta: artist') || split[i].includes('{meta: a') || split[i].includes('{ meta: a')) {
            //console.log(split[i]);
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
//Gets Composer of Song
function getComposer(song) {
    let split = song.split('\n');
    let composer = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{composer:") || split[i].includes('{ composer:')) {
            //console.log(split[i]);
            composer = split[i].replace("{composer:", '');
            composer = composer.replace('{ composer:', '');
            composer = composer.replace('}', '');
            return composer.trim();
        } else if (split[i].includes('{meta: composer') || split[i].includes('{ meta: composer')) {
            //console.log(split[i]);
            composer = split[i].replace('{meta: composer', '');
            composer = composer.replace('{ meta: composer', '');
            composer = composer.replace('}', '');
            return composer.trim();
        }
    }
    return "Undefined";
}
//Gets Lyricist of Song
function getLyricist(song) {
    let split = song.split('\n');
    let lyricist = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{lyricist:") || split[i].includes('{ lyricist:')) {
            //console.log(split[i]);
            lyricist = split[i].replace("{lyricist:", '');
            lyricist = lyricist.replace('{ lyricist:', '');
            lyricist = lyricist.replace('}', '');
            return lyricist.trim();
        } else if (split[i].includes('{meta: lyricist') || split[i].includes('{ meta: lyricist')) {
            //console.log(split[i]);
            lyricist = split[i].replace('{meta: lyricist', '');
            lyricist = lyricist.replace('{ meta: lyricist', '');
            lyricist = lyricist.replace('}', '');
            return lyricist.trim();
        }
    }
    return "Undefined";
}
//Gets Copyright of Song
function getCopyright(song) {
    let split = song.split('\n');
    let copyright = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{copyright:") || split[i].includes('{ copyright:')) {
            //console.log(split[i]);
            copyright = split[i].replace("{copyright:", '');
            copyright = copyright.replace('{ copyright:', '');
            copyright = copyright.replace('}', '');
            return copyright.trim();
        } else if (split[i].includes('{meta: copyright') || split[i].includes('{ meta: copyright')) {
            //console.log(split[i]);
            copyright = split[i].replace('{meta: copyright', '');
            copyright = copyright.replace('{ meta: copyright', '');
            copyright = copyright.replace('}', '');
            return copyright.trim();
        }
    }
    return "Undefined";
}
//Gets Album of Song
function getAlbum(song) {
    let split = song.split('\n');
    let album = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{album:") || split[i].includes('{ album:')) {
            //console.log(split[i]);
            album = split[i].replace("{album:", '');
            album = album.replace('{ album:', '');
            album = album.replace('}', '');
            return album.trim();
        } else if (split[i].includes('{meta: album') || split[i].includes('{ meta: album')) {
            //console.log(split[i]);
            album = split[i].replace('{meta: album', '');
            album = album.replace('{ meta: album', '');
            album = album.replace('}', '');
            return album.trim();
        }
    }
    return "Undefined";
}
//Gets Year of Song
function getYear(song) {
    let split = song.split('\n');
    let year = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{year:") || split[i].includes('{ year:') || split[i].includes('{y:') || split[i].includes('{ y:')) {
            //console.log(split[i]);
            year = split[i].replace("{year:", '');
            year = year.replace('{ year:', '');
            year = year.replace('{y:', '');
            year = year.replace('{ y:', '');
            year = year.replace('}', '');
            return year.trim();
        } else if (split[i].includes('{meta: year') || split[i].includes('{ meta: year') || split[i].includes('{meta: y') || split[i].includes('{ meta: y')) {
            //console.log(split[i]);
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
//Gets Key of Song
function getKey(song) {
    let split = song.split('\n');
    let key = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{key:") || split[i].includes('{ key:')) {
            //console.log(split[i]);
            key = split[i].replace("{key:", '');
            key = key.replace('{ key:', '');
            key = key.replace('}', '');
            return key.trim();
        } else if (split[i].includes('{meta: key') || split[i].includes('{ meta: key')) {
            //console.log(split[i]);
            key = split[i].replace('{meta: key', '');
            key = key.replace('{ meta: key', '');
            key = key.replace('}', '');
            return key.trim();
        }
    }
    return "Undefined";
}
//Gets Time of Song
function getTime(song) {
    let split = song.split('\n');
    let time = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{time:") || split[i].includes('{ time:')) {
            //console.log(split[i]);
            time = split[i].replace("{time:", '');
            time = time.replace('{ time:', '');
            time = time.replace('}', '');
            return time.trim();
        } else if (split[i].includes('{meta: time') || split[i].includes('{ meta: time')) {
            //console.log(split[i]);
            time = split[i].replace('{meta: time', '');
            time = time.replace('{ meta: time', '');
            time = time.replace('}', '');
            return time.trim();
        }
    }
    return "Undefined";
}
//Gets Tempo of Song
function getTempo(song) {
    let split = song.split('\n');
    let tempo = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{tempo:") || split[i].includes('{ tempo:')) {
            //console.log(split[i]);
            tempo = split[i].replace("{tempo:", '');
            tempo = tempo.replace('{ tempo:', '');
            tempo = tempo.replace('}', '');
            return tempo.trim();
        } else if (split[i].includes('{tempo: key') || split[i].includes('{ tempo: key')) {
            //console.log(split[i]);
            tempo = split[i].replace('{meta: tempo', '');
            tempo = tempo.replace('{ meta: tempo', '');
            tempo = tempo.replace('}', '');
            return tempo.trim();
        }
    }
    return "Undefined";
}
//Gets Duration of Song
function getDuration(song) {
    let split = song.split('\n');
    let duration = "";
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{duration:") || split[i].includes('{ duration:')) {
            //console.log(split[i]);
            duration = split[i].replace("{duration:", '');
            duration = duration.replace('{ duration:', '');
            duration = duration.replace('}', '');
            return duration.trim();
        } else if (split[i].includes('{meta: duration') || split[i].includes('{ meta: duration')) {
            //console.log(split[i]);
            duration = split[i].replace('{meta: duration', '');
            duration = duration.replace('{ meta: duration', '');
            duration = duration.replace('}', '');
            return duration.trim();
        }
    }
    return "Undefined";
}