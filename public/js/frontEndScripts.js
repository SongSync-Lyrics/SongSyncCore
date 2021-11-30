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
let urlContainer = document.getElementById('urlContainer');
let followerStartButton = document.getElementById('followerStartButton');
let joinBackButton = document.getElementById('joinBackButton');
let postBackButton = document.getElementById('postBackButton');
let leaderCreateForm1 = document.getElementById('leaderCreateForm');
let firstMenu = document.getElementById('firstMenu');
let portrait = document.getElementById('portrait');
let upArrow = document.getElementById('upArrowButton');
let formLink = document.getElementById('formLink');




if (initialCreateButton.click = true) {
    centeringCard.style.height = '24vh';
}

postBackButton.addEventListener('click', function() {
    subChordProContainer.style.display='none';
    firstMenu.style.display='block'
    startButton.style.display='none'
    sessionCode.style.display='none';
    postBackButton.style.display = 'none';
    backButton.style.display='flex';
    nextButton.style.display='flex';

})



nextButton.addEventListener('click', function() {
    sessionCode.style.display = 'flex';
    startButton.style.display = 'flex';
    subChordProContainer.style.display = 'flex';
    firstMenu.style.display='none';
    startButton.style.width = "100%";
    backButton.style.display = 'none';
    nextButton.style.display = 'none';
    postBackButton.style.display = 'flex';

});

startButton.addEventListener('click', function() {
    document.body.style.background = '#fff';
    container.style.display = 'none';
    portrait.style.display='block';
    formLink.style.color='black';   
})

followerStartButton.addEventListener('click', function() {
    document.body.style.background = '#fff';
    container.style.display = 'none';
    portrait.style.display='block';
    formLink.style.color='black';
})

initialCreateButton.addEventListener('click', function() {
    subInputs.style.display = 'none';
    chordProContainer.style.display = 'flex';
    subChordProContainer.style.display = 'none';
    startButton.style.display = 'none';
    centeringCard.style.height = '30vh';
    arrows.style.display='flex';

});

initialJoinButton.addEventListener('click', function() {
    sessionCode.style.display = 'flex';
    subInputs.style.display = 'none';
    enterSession.style.display = 'flex';
    joinBackButton.style.display = 'flex';
    arrows.style.display='none';
    document.addEventListener("keyup", function(event) {
        if (event.code === 'Enter') {
            document.body.style.background = '#fff';
        }

    })
});

