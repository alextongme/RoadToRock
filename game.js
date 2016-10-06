$(document).ready(function() { //LOAD DOM
console.log('i am ready');

//MUSIC FILES
var ledzep = new Audio("LedZeppelin.mp3");
var kansas = new Audio("Kansas.mp3");
var eagles = new Audio("TheEagles.mp3");
var rollingstones = new Audio("RollingStones.mp3");
var hollies = new Audio("TheHollies.mp3");
var blueoystercult = new Audio("BlueOysterCult.mp3");

var songs = [{
  song: ledzep,
  bandname: 'LED ZEPPELIN'
  },
  {
    song: kansas,
    bandname: 'KANSAS'
  },
  {
    song: eagles,
    bandname: 'EAGLES'
  },
  {
    song: rollingstones,
    bandname: 'ROLLING STONES'
  },
  {
    song: blueoystercult,
    bandname: 'BLUE OYSTER CULT'
  },
  {
    song: hollies,
    bandname: 'HOLLIES'
  }];

//plays audio when startpage is loaded

//VARIABLES
var score = 0;
var strikes = 0;
var songNumber = 0;

var displayScore = $('.points').text(); //KEEPS ACTIVE COUNTING DISPLAY OF SCORE
var displayStrikes = $('.negativepoints').text(); //KEEPS ACTIVE COUNTING DISPLAY OF STRIKES

//FUNCTIONS
function shuffle(array) { //THE FISHER YATES SHUFFLE
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function checkValue (event) { //FUNCTION TO CHECK IF USER INPUT MATCHES THE ARTIST NAME
  var input = $('.answer')[0].value;
  input = input.toUpperCase(); //makes all input uppercase so that we can check it easier even if the user decides to use caps or no caps.
  if (input == songs[songNumber].bandname) {
  score ++;
  }
  else if (input == 'THE ' + (songs[songNumber].bandname)) {
    score ++;
  }
  else {
    strikes ++;
  }
  $('.answer')[0].value = ''; //resets the input text field for the next question
  console.log(score);
  console.log(strikes);
  stopMusic();
  update();
}

function update() {
  $('.points').text(score);
  $('.negativepoints').text(strikes);
}

function stopMusic() {
  var soundTrack = songs[songNumber].song;
  soundTrack.pause(); //Pauses the song after the submit button is hit
  songNumber++; //Song changes to next one in array after each submit
  $('.play').click(playMusic); //Re-adds the click listener for the next song
}

function playMusic() {
  var soundTrack = songs[songNumber].song;
  soundTrack.play();
  $('.play').unbind('click'); //FIX THIS. USER HAS TO BE ABLE TO CLICK AGAIN
}

//EVENT LISTENERS
shuffle(songs);
$('.play').click(playMusic); //Music only plays when button is clicked.
$('.submit').click(checkValue); //Submit value: Resets input, stops music

});
