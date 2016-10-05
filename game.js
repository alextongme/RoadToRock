$(document).ready(function() { //LOAD DOM
console.log('i am ready');

//MUSIC FILES
var ledzep = new Audio("LedZeppelin.mp3");
var kansas = new Audio("Kansas.mp3");
var eagles = new Audio("TheEagles.mp3");
var songs = [{
  song: ledzep,
  bandname: 'LED ZEPPELIN'
  }, {
    song: kansas,
    bandname: 'KANSAS'
  }];

//VARIABLES
var score = 0;
var strikes = 0;
var songNumber = 0;

//FUNCTIONS
function checkValue (event) {
  var input = $('.answer')[0].value;
  input = input.toUpperCase(); //makes all input uppercase so that we can check it easier even if the user decides to use caps or no caps.
  if (input == songs[songNumber].bandname) {
  score ++;
  }
  else {
    strikes ++;
  }
  $('.answer')[0].value = ''; //resets the input text field for the next question
  console.log(score);
  console.log(strikes);
  songNumber++; //Song changes to next one in array after each submit.
}


function playMusic() {
  soundTrack = songs[songNumber].song; //plays audio when startpage is loaded
  soundTrack.play();
  $('.play').unbind('click'); //FIX THIS. USER HAS TO BE ABLE TO CLICK AGAIN
}


//EVENT LISTENERS
$('.play').click(playMusic); //Music only plays when button is clicked.
$('.submit').click(checkValue);
});
