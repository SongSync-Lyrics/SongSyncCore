// Initialize Socket.IO
let socket = io();

// References to HTML file
const startingSection = document.querySelector('.starting-section');
const homeBtn = document.querySelector('.home-btn');
let crazyButton = document.getElementById('crazyButton');

// When startButton is clicked, send response to server
startButton.addEventListener('click', () => {
    socket.emit('startGame');
})

// When socket.io receives 'startGame' response from server, run hideStartButton
socket.on('startGame', () => {
    hideStartButton();
})

// Function that hides startButton, displays redSquare
function hideStartButton() {
    startButton.style.display = "none";
    crazyButton.style.display = "block";
    startingSection.style.display = "none";
}

// When redSquare is clicked, send response to server containing a randomized movement command with it. Movement command is based on screen size
crazyButton.addEventListener('click', () => {
    socket.emit('crazyIsClicked', {
        offsetLeft: Math.random() * ((window.innerWidth - crazyButton.clientWidth) - 100),
        offsetTop: Math.random() * ((window.innerHeight - crazyButton.clientHeight) - 50)
    });
})

// When socket.io receives 'crazyIsClicked' response from server, run goCrazy. Data contains values given from first client response
socket.on('crazyIsClicked', (data) => {
    goCrazy(data.offsetLeft, data.offsetTop);
});

// Based on values given, set new redSquare location
function goCrazy(offLeft, offTop) {
    let top, left;

    left = offLeft;
    top = offTop;

    crazyButton.style.top = top + 'px';
    crazyButton.style.left = left + 'px';
    crazyButton.style.animation = "none";
}