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
let nextButton = document.getElementById('nextButton');
let followerStartButton = document.getElementById('followerStartButton');
let joinBackButton = document.getElementById('joinBackButton');
let postBackButton = document.getElementById('postBackButton');
let firstMenu = document.getElementById('firstMenu');
let portrait = document.getElementById('portrait');
let formLink = document.getElementById('formLink');
let darkMode = document.getElementById('darkMode')
let darkModeLyrics = document.getElementById('darkModeLyrics')
let logo = document.getElementById('logo')
let staticImage = document.getElementById('staticImage');
let screen = document.getElementById('screen')
let paragraph = document.querySelectorAll('.paragraph');
let sessionName = document.getElementById('session-name');
let darkModeText = document.getElementById('darkModeText');
let darkModeTextLyrics = document.getElementById('darkModeTextLyrics');


/* if (initialCreateButton.click = true) {
    centeringCard.style.height = '18vh';
} */

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
    portrait.style.display='flex';
    formLink.style.color='black';
    darkMode.style.display = 'none';
    darkModeLyrics.style.display='block';
    darkModeText.style.display='none'
    darkModeTextLyrics.style.display='block'
    darkModeTextLyrics.style.color='black'

    if(darkModeLyrics.checked==true){
        darkModeLyrics.dispatchEvent(new Event('change'))
    }
})

followerStartButton.addEventListener('click', function() {
    document.body.style.background = '#fff';
    container.style.display = 'none';
    portrait.style.display='flex';
    formLink.style.color='black';
    darkMode.style.display = 'none';
    darkModeLyrics.style.display='block';
    darkModeText.style.display='none'
    darkModeTextLyrics.style.display='block'
    darkModeTextLyrics.style.color='black'


    if(darkModeLyrics.checked==true){
        darkModeLyrics.dispatchEvent(new Event('change'))
    }else{
        darkModeLyrics.dispatchEvent(new Event('change'))
    }
  

})

initialCreateButton.addEventListener('click', function() {
    subInputs.style.display = 'none';
    chordProContainer.style.display = 'flex';
    subChordProContainer.style.display = 'none';
    startButton.style.display = 'none';
    //centeringCard.style.height = '30vh';
    arrows.style.display='flex';

});

initialJoinButton.addEventListener('click', function() {
    sessionCode.style.display = 'flex';
    subInputs.style.display = 'none';
    enterSession.style.display = 'flex';
    joinBackButton.style.display = 'flex';
    arrows.style.display='none';
    //centeringCard.style.height = '25vh';
    followerStartButton.style.display='block'
});

backButton.addEventListener('click', function(){
    chordProContainer.style.display='none';
    centeringCard.style.display='flex'
    subInputs.style.display='flex'
})

joinBackButton.addEventListener('click', function(){
    sessionCode.style.display='none'
    followerStartButton.style.display='none'
    joinBackButton.style.display='none'
    centeringCard.style.display='flex'
    subInputs.style.display='flex'
})
darkMode.addEventListener('change', function(e){
    if(e.target.checked){
        centeringCard.classList.add('dark-color-mode');
        document.body.style.background = "url('css/pictures/darkGuitar.jpg')";
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundSize = 'cover'
        darkModeLyrics.checked=true;

    }else{
        centeringCard.classList.remove('dark-color-mode')
        logo.classList.remove('dark-color-mode');
        staticImage.classList.add('dark-color-mode');
        document.body.style.background = "linear-gradient(rgba(255, 255, 255, 0.2),rgba(255, 255, 255, 0.2),rgba(255, 255, 255, 0.2),rgba(255, 255, 255, 0.2)),url('css/pictures/Ukelele.jpg')";
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundSize = 'cover';


    }});
darkModeLyrics.addEventListener('change', function(e){
        if(e.target.checked){    
            screen.classList.add('dark-color-mode-lyrics')
            document.body.style.background = 'black';
            sessionName.style.color='#fff'
            darkModeTextLyrics.classList.add('dark-color-mode')

        }else{
            screen.classList.remove('dark-color-mode-lyrics')
            document.body.style.background = '#fff';
            sessionName.style.color='black'
            darkModeTextLyrics.classList.remove('dark-color-mode')

        }
    }
    );