let startButton = document.querySelectorAll('#startButton');
let initialCreateButton = document.getElementById('initialCreateButton');
let subInputs = document.getElementById('subInputs');
let sessionCode = document.getElementById('input');
let chordProContainer = document.getElementById('chordProContainer');
let initialJoinButton = document.getElementById('initialJoinButton');
let enterSession = document.getElementById('enterSession');


startButton.forEach((startButton) => startButton.addEventListener('click', function(){
    document.body.style.background = '#fff';}));

 initialCreateButton.addEventListener('click', function(){
    subInputs.style.display = 'none';
    sessionCode.style.display = 'flex';
    chordProContainer.style.display='flex';

});
initialJoinButton.addEventListener('click', function(){
    sessionCode.style.display='flex';
    subInputs.style.display='none';
    enterSession.style.display = 'flex';

}); 