let startButton = document.getElementById('startButton');
let initialCreateButton = document.getElementById('initialCreateButton');
let subInputs = document.getElementById('subInputs');
let sessionCode = document.getElementById('input');
let chordProContainer = document.getElementById('chordProContainer');
let initialJoinButton = document.getElementById('initialJoinButton');
let enterSession = document.getElementById('enterSession');
let container = document.getElementById('container');
let centeringCard = document.getElementById('centeringCard');
let subChordProContainer = document.getElementById('subChordProContainer');
let backButton = document.getElementById('backButton');
let chordProInput = document.getElementById('chordproInput');
let nextButton = document.getElementById('nextButton');
let chordProText = document.getElementById('chordProText');
let urlContainer =document.getElementById('urlContainer');
let followerStartButton =document.getElementById('followerStartButton');





if(initialCreateButton.click = true){
    centeringCard.style.height = '24vh';
}

nextButton.addEventListener('click', function(){
    sessionCode.style.display='flex';
    //enterSession.style.display='flex';
    startButton.style.display='flex';
    subChordProContainer.style.display='flex';
    chordProText.style.display='none';
    urlContainer.style.display='none';
    startButton.style.width="100%";
    backButton.style.display='none';
    
});

 /*startButton.forEach((startButton) => startButton.addEventListener('click', function () {
    document.body.style.background = '#fff';
    container.style.display = 'none';
})); */
startButton.addEventListener('click', function(){
    document.body.style.background='#fff';
    container.style.display='none';
})
followerStartButton.addEventListener('click', function(){
    document.body.style.background='#fff';
    container.style.display='none';
})





initialCreateButton.addEventListener('click', function () {
    subInputs.style.display = 'none';
    //sessionCode.style.display = 'flex';
    chordProContainer.style.display = 'flex';
    subChordProContainer.style.display='none';
    startButton.style.display='none';
    centeringCard.style.height='30vh';
    backButton2.style.display='none'

});

initialJoinButton.addEventListener('click', function () {
    sessionCode.style.display = 'flex';
    subInputs.style.display = 'none';
    enterSession.style.display = 'flex';
    document.addEventListener("keyup", function (event) {
        if (event.code === 'Enter') {
            document.body.style.background = '#fff';
        }

    })
});