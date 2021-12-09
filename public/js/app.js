const socket = io();

let leaderCreateForm = document.getElementById('leaderCreateForm');
let followerCreateForm = document.getElementById('followerJoinForm');
let input = document.getElementById('input');
let chordproFileInput = document.getElementById('chordproFile');
let chordproUrlInput = document.getElementById('chordProUrl');
let uploadButton = document.getElementById('nextButton');

let downArrow = document.getElementById('downArrowButton');
let upArrow = document.getElementById('upArrowButton')
let arrows = document.getElementById('arrows');

let song;
let validFile = true;
var visibleTables = [];
var vtl;

let room;
let fileUpload = false;

uploadButton.addEventListener('click', async() => {
    if(chordproFileInput !=null || (chordproUrlInput !=null)){
        if (fileUpload) {
            console.log("file upload");
            parseChordProFile();
        }
        else{
            console.log("Url upload")
            await retrieveUrl();

        }
    }
})

chordproFileInput.addEventListener('change', () => {
    fileUpload = true;
})

let acceptedExtensions = ['cho', 'crd', 'chopro', 'chord', 'pro'];

//check on file upload whether extension is valid remove disabled attribute to make button clickable if conditions are met
chordproFileInput.addEventListener('change', function(){
    let trueExtension = chordproFileInput.value.split('.').pop();
    if(!acceptedExtensions.includes(trueExtension)){
        alert('Not a valid ChordPro File or you have pasted a URL');
        chordproFileInput.value = '';

    }else if(chordproUrlInput.value !== ''){
        chordproUrlInput.value='';
        alert('Please only select one option')
        
    }else{
        nextButton.removeAttribute("disabled")
    }
    
})
//check to make sure only one option is selected and allow nextButton to be clickable
chordproUrlInput.addEventListener('input', function(){
    fileUpload=false;
    let trueExtension = chordproUrlInput.value.split('.').pop();
    let notValidUrlLabel = document.getElementById('notValidUrl');
    if(chordproFileInput.value !=''){
        alert('Please select one option');
        chordproFileInput.value = '';
    }else if(!acceptedExtensions.includes(trueExtension)){
        notValidUrlLabel.style.display='block';
        nextButton.setAttribute('disabled', 'disabled');
    }
    else{
        notValidUrlLabel.style.display='none';
        nextButton.removeAttribute('disabled', 'disabled');
    }
})

input.addEventListener('input', function(){
    startButton.removeAttribute('disabled');
    followerStartButton.removeAttribute('disabled');

})
//after user enters session code, on enter press automatically creates session


 async function retrieveUrl() {
    let url = chordproUrlInput.value;
    if (url.substring(url.includes(acceptedExtensions.values))
    /* url.includes('.cho') || url.includes('.crd') ||
        url.includes('.chopro') || url.includes('.chord') ||
        url.includes('.pro') */) {
        await socket.emit('getChordProFromUrl', (url));
    } else {
        alert("This is not a valid ChordPro file");
        validFile = false;
        chordproUrlInput.value = '';
    }
}

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

function parseChordProFile() {
    let fileName = chordproFileInput.files[0].name;
    if (fileName.substring(fileName.includes(acceptedExtensions.values))
    /* fileName.includes('.cho') || fileName.includes('.crd') ||
        fileName.includes('.chopro') || fileName.includes('.chord') ||
        fileName.includes('.pro') */) {
        let fr = new FileReader();
        fr.onload = function() {
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

leaderCreateForm.addEventListener('submit', function(e) {
    e.preventDefault()
    if (validFile == false) {
        chordproFileInput.value = null;
    } else {
        if (input.value) {
            room = input.value
            if (song != undefined) {
                console.log("ChordPro File found")
                socket.emit('startGame', input.value)
                socket.emit('displayLeaderLyrics', input.value, song)
            } else {
                console.log("Running follower code")
                socket.emit('startGame', input.value)
                socket.emit('displayFollowerLyrics', input.value)
            }

            console.log("Joining room: " + input.value)
        }
    }
});

followerCreateForm.addEventListener('submit', function(e) {
    e.preventDefault()
    if (input.value) {
        room = input.value

        if (song != undefined) {
            console.log("ChordPro File found")
            socket.emit('startGame', input.value)
            socket.emit('displayLeaderLyrics', input.value, song)
        } else {
            console.log("Running follower code")
            socket.emit('startGame', input.value)
            socket.emit('displayFollowerLyrics', input.value)
        }

        console.log("Joining room: " + input.value)
    }
});

function hideStartButton() {
    leaderCreateForm.style.display = "none"
}

socket.on('startGame', () => {
    hideStartButton()
});

socket.on('displayLyrics', (lyrics) => {
    document.getElementById('screen').style.display = 'flex';
    document.getElementById('display').style.display = 'block';
    document.getElementById('song-info').style.display = 'flex';
    document.getElementById('display').innerHTML = lyrics;
    document.getElementById('session-name').innerHTML = "Session: " + room;
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

socket.on('enableScroll', () => {
    console.log('scroll enabled');
    document.addEventListener("keydown", keyDownScroll, false);
});

socket.on('move', (vt) => {
    visibleTables = vt;
    visibleTables.length = vtl;
    displayTables();
})

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
downArrow.addEventListener('click', function(){
    moveDown();
    socket.emit('scroll',room, visibleTables );
});

upArrow.addEventListener('click', function(){
    moveUp();
    socket.emit('scroll', room, visibleTables);
})


function keyDownScroll(e) {
    //speed = document.getElementsByClassName('row')[0].clientHeight;
    console.log(visibleTables);
    var keyCode = e.keyCode;
    if (keyCode == 40 || keyCode == 34) {
        console.log("down");
        moveDown();
        socket.emit('scroll', room, visibleTables);
        /*console.log("DivPos: " + divPos);
        let x = divPos - scrollSpeed;
        console.log("x: " + x);
        document.getElementById('display').style.top = x + "%";
        divPos = x;
        console.log("DivPos: " + divPos);
        socket.emit('scroll', room, divPos);
        //socket.emit('scrollDown', room);*/
    } else if (keyCode == 38 || keyCode == 33) {
        console.log("up");
        moveUp();
        socket.emit('scroll', room, visibleTables);
        
        /*console.log("DivPos: " + divPos);
        let x = divPos + scrollSpeed;
        console.log("x: " + x);
        display.style.top = x + "%";
        divPos = x;
        console.log("DivPos: " + divPos);
        socket.emit('scroll', room, divPos);
        //socket.emit('scrollUp', room);*/
    }
    //console.log("Div Position: " + divPos);
}

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

//GETTERS FOR CHORDPRO ATTRIBUTES
//Gets Title of Song
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
//Gets Subtitle of Song
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
//Gets Artist of Song
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
//Gets Composer of Song
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
//Gets Lyricist of Song
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
//Gets Copyright of Song
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
//Gets Album of Song
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
//Gets Year of Song
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
//Gets Key of Song
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
}
//Gets Time of Song
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
//Gets Tempo of Song
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
}
//Gets Duration of Song
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


