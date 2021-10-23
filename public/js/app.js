// Initialize Socket.IO
let socket = io()

let room
let form = document.getElementById('form')
let input = document.getElementById('input')


// References to HTML file
const startingSection = document.querySelector('.starting-section')
const homeBtn = document.querySelector('.home-btn')
const crazyButton = document.getElementById('crazyButton')
const leaderLabel = document.getElementById('leader')
const followerLabel = document.getElementById('follower')


// When startButton is clicked, send response to server
//startButton.addEventListener('click', () => {
form.addEventListener('submit', function(e) {
    e.preventDefault()
    if (input.value) {
        room = input.value
        socket.emit('startGame', input.value)
        console.log("Joining room: " + input.value)
    }
})

homeBtn.addEventListener('click', () => {
    socket.emit('listConnectedUsers')
})

// When redSquare is clicked, send response to server containing a randomized movement command with it. Movement command is based on screen size
crazyButton.addEventListener('click', () => {
    socket.emit('crazyIsClicked', {
        offsetLeft: Math.random() * ((window.innerWidth - crazyButton.clientWidth) - 100),
        offsetTop: Math.random() * ((window.innerHeight - crazyButton.clientHeight) - 50)
    }, room)
})


// When socket.io receives 'startGame' response from server, run hideStartButton
socket.on('startGame', () => {
    hideStartButton()
    socket.emit('leaderStatus', room)
})

socket.on('leaderStatus', (leaderStatus) => {
    if(leaderStatus){
        leaderLabel.style.display = "block"
    } else {
        followerLabel.style.display = "block"
    }
})

socket.on('leaderDisconnect', () => {
    followerLabel.innerHTML = "Leader has disconnected"
})

// When socket.io receives 'crazyIsClicked' response from server, run goCrazy. Data contains values given from first client response
socket.on('crazyIsClicked', (data) => {
    goCrazy(data.offsetLeft, data.offsetTop)
})

// Based on values given, set new redSquare location
function goCrazy(offLeft, offTop) {
    let top, left

    left = offLeft
    top = offTop

    crazyButton.style.top = top + 'px'
    crazyButton.style.left = left + 'px'
    crazyButton.style.animation = "none"
}

// Function that hides startButton, displays redSquare
function hideStartButton() {
    //startButton.style.display = "none"
    input.value = ''
    form.style.display = "none"
    crazyButton.style.display = "block"
}