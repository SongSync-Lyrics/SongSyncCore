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
let joinBackButtonLink = document.getElementById('joinBackButtonLink');
let leaveSession = document.getElementById('leaveSession')
let leaveSessionLink = document.getElementById('leaveSessionLink')
let landingPage = document.getElementById('landingPage')
let landingPageInfo = document.getElementById('landingPageInfo')
let landingPageSupport = document.getElementById('landingPageSupport')
let nextSongFileText = document.getElementById('nextSongFileText')





/* if (initialCreateButton.click = true) {
    centeringCard.style.height = '18vh';
} */

postBackButton.addEventListener('click', function () {
    subChordProContainer.style.display = 'none';
    firstMenu.style.display = 'block'
    startButton.style.display = 'none'
    sessionCode.style.display = 'none';
    postBackButton.style.display = 'none';
    backButton.style.display='flex';
    nextButton.style.display='flex';
    sessionCode.value=''
    backButton.style.display = 'flex';
    nextButton.style.display = 'flex';

})



nextButton.addEventListener('click', function () {
    sessionCode.style.display = 'flex';
    startButton.style.display = 'flex';
    subChordProContainer.style.display = 'flex';
    firstMenu.style.display = 'none';
    startButton.style.width = "100%";
    backButton.style.display = 'none';
    nextButton.style.display = 'none';
    postBackButton.style.display = 'flex';

}); 
startButton.addEventListener('click', function () {
    container.style.display = 'none';
    portrait.style.display='flex';
    formLink.style.color='black';
    darkMode.style.display = 'none';
    leaveSession.style.display='flex'
    leaveSessionLink.style.color='black'
    landingPageInfo.style.color='black'
    landingPageSupport.style.color='black'
    landingPageInfo.style.display='none'
    onLyricsPage=true;
    portrait.style.display = 'flex';
    formLink.style.color = 'black';
    nextSongButton.style.display = "flex";
    document.body.style.background='none';
    nextSongFile.value=''    
    chordproFileInput.value=''
    arrows.style.display='flex'
    if(!darkModeIsClicked){
        document.body.style.backgroundColor='black'
    }
})

followerStartButton.addEventListener('click', function () {
    container.style.display = 'none';
    portrait.style.display='flex';
    leaveSession.style.display='flex'
    landingPageInfo.style.display='none'
    landingPageSupport.style.color='black'
    document.body.style.background='none'
    onLyricsPage=true;
    document.body.style.background='none';
    portrait.style.display = 'flex';
    if(!darkModeIsClicked){
        document.body.style.backgroundColor='black'
    }
})

initialCreateButton.addEventListener('click', function () {
    subInputs.style.display = 'none';
    chordProContainer.style.display = 'flex';
    subChordProContainer.style.display = 'none';
    startButton.style.display = 'none';
    //centeringCard.style.height = '30vh';

});
initialJoinButton.addEventListener('click', function() {
    //centeringCard.style.height = '30vh';
    arrows.style.display = 'flex';
});

initialJoinButton.addEventListener('click', function () {
    sessionCode.style.display = 'flex';
    subInputs.style.display = 'none';
    enterSession.style.display = 'flex';
    joinBackButton.style.display = 'flex';
    arrows.style.display='none';
    //centeringCard.style.height = '25vh';
    followerStartButton.style.display='block'

    arrows.style.display = 'none';
   // centeringCard.style.height = '25vh';
});

backButton.addEventListener('click', function(){
    chordProContainer.style.display='none';
    centeringCard.style.display='flex'
    subInputs.style.display='flex'
    sessionCode.value=''
    chordproFileInput.value='';
    chordproUrlInput.value=''

})

joinBackButton.addEventListener('click', function(){
    sessionCode.style.display='none'
    followerStartButton.style.display='none'
    joinBackButton.style.display='none'
    centeringCard.style.display='flex'
    subInputs.style.display='flex'
    sessionCode.value=''
})

let darkModeIsClicked = true;
let onLyricsPage=false;

let darkModeButton = document.getElementById('darkModeButton');
darkModeButton.addEventListener('click', function(){
    darkMode.dispatchEvent(new Event('change'))
    console.log(onLyricsPage)
    darkMode.checked;
})
darkMode.addEventListener('change', function(){
    if(darkModeIsClicked){
        darkModeButton.innerHTML='Light'
        if(!onLyricsPage){
            document.body.style.background = "url('css/pictures/darkGuitar.jpg')";
        }
        centeringCard.classList.add('dark-color-mode');
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundSize = 'cover'
        screen.classList.add('dark-color-mode-lyrics')
        document.body.style.backgroundColor='black'
        sessionName.style.color='#fff'
        landingPageInfo.classList.add('dark-color-mode')
        landingPageSupport.classList.add('dark-color-mode')
        arrows.classList.add('dark-color-mode')
        darkModeIsClicked=false;

    }else if(!darkModeIsClicked){
        darkModeButton.innerHTML='Dark'

        if(!onLyricsPage){
            document.body.style.background = "linear-gradient(rgba(255, 255, 255, 0.2),rgba(255, 255, 255, 0.2),rgba(255, 255, 255, 0.2),rgba(255, 255, 255, 0.2)),url('css/pictures/Ukelele.jpg')";
        }
        landingPage.classList.remove('dark-color-mode')
        landingPageInfo.classList.remove('dark-color-mode')
        landingPageSupport.classList.remove('dark-color-mode')
        centeringCard.classList.remove('dark-color-mode')
        logo.classList.remove('dark-color-mode');
        staticImage.classList.add('dark-color-mode');
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundSize = 'cover';
        screen.classList.remove('dark-color-mode-lyrics')
        if(onLyricsPage){
            document.body.style.background = '#fff';
        }
        sessionName.style.color='black'
        leaveSessionLink.style.color='black'
        landingPageInfo.classList.remove('dark-color-mode')
        landingPageSupport.classList.remove('dark-color-mode')
        arrows.classList.remove('dark-color-mode')
        darkModeIsClicked=true;

    }
});
let nextSongFile = document.getElementById('nextSongFile');
nextSongFile.addEventListener('change', function(){
    nextSongFileText.innerHTML=nextSongFile.value.split(/(\\|\/)/g).pop();
})