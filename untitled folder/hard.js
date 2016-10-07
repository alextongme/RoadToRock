$(document).ready(function() { //LOAD DOM
console.log('DOM LOADED');

//ALL VARIABLES
  //MUSIC FILES LEVEL 1
var ledzep = new Audio("./levelone/LedZeppelin.mp3");
var kansas = new Audio("./levelone/Kansas.mp3");
var eagles = new Audio("./levelone/TheEagles.mp3");
var rollingstones = new Audio("./levelone/RollingStones.mp3");
var hollies = new Audio("./levelone/TheHollies.mp3");
var blacksabbath = new Audio("./levelone/BlackSabbath.mp3");
var heart = new Audio("./levelone/Heart.mp3");
var lynyrdskynyrd = new Audio("./levelone/LynyrdSkynyrd.mp3");
var pinkfloyd = new Audio("./levelone/PinkFloyd.mp3");
var rodstewart = new Audio("./levelone/RodStewart.mp3");

  // MUSIC FILES LEVEL 2
var blueoystercult = new Audio("./levelone/BlueOysterCult.mp3");

  //ARRAY OF SONGS AND ANSWERS
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
    song: heart,
    bandname: 'HEART'
  },
  {
    song: rodstewart,
    bandname: 'ROD STEWART'
  },
  {
    song: blacksabbath,
    bandname: 'BLACK SABBATH'
  },
  {
    song: lynyrdskynyrd,
    bandname: 'LYNYRD SKYNYRD'
  },
  {
    song: pinkfloyd,
    bandname: 'PINK FLOYD'
  },
  {
    song: hollies,
    bandname: 'HOLLIES'
  }];

  // ADDITIONAL VARIABLES
var score = 0;
var strikes = 0;
var songNumber = 0;
var displayScore = $('.points').text(); //KEEPS ACTIVE COUNTING DISPLAY OF SCORE
var displayStrikes = $('.negativepoints').text(); //KEEPS ACTIVE COUNTING DISPLAY OF STRIKES

//FUNCTIONS
function shuffle(array) { //THE FISHER YATES SHUFFLE (FOR ARRAY OF SONGS AND ANSWERS)
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
  input = input.toUpperCase(); //makes all input uppercase so that we can check it correctly even if the user decides to use caps or no caps.
  if (input == songs[songNumber].bandname) {
  score ++;
  }
  else if (input == 'THE ' + (songs[songNumber].bandname)) { //in case user inputs "the " in front of band name
    score ++;
  }
  else {
    strikes ++;
  }
  $('.answer')[0].value = ''; //resets the input text field for the next question
  stopMusic(); //stop music from playing and proceed to next round
  update(); //update scoreboard
  checkWin();
}

function update() { //UPDATES THE DISPLAYED SCOREBOARD
  $('.points').text(score);
  $('.negativepoints').text(strikes);
}

function stopMusic() { //STOPS MUSIC AFTER SUBMIT IS PRESSED
  var soundTrack = songs[songNumber].song;
  soundTrack.pause(); //Pauses the song after the submit button is hit
  songNumber++; //Song changes to next one in array after each submit
  $('.play').click(playMusic); //Re-adds the click listener for the next song
}

function playMusic() { //PLAYS MUSIC WHEN PLAY BUTTON IS TRIGGERED
  var soundTrack = songs[songNumber].song;
  soundTrack.play();
  $('.play').unbind('click'); //FIX THIS. USER HAS TO BE ABLE TO CLICK AGAIN
}

function checkWin () { //check if player won and plays congrats video
  // if (songNumber == 10 && score > 7 ) {
  if (songNumber == 1) {
  $('.main').remove(); //removes entire gameboard
  $('body').append("<h1 class='congrats'>YOU WON! You're a star!</h1>"); //displays congrats message
  $('#bgvid')[0].muted = false; //unmutes the video
  $('#bgvid')[0].volume = 0.1; //adjust volume of video
  $('video').css('filter', 'blur(0px)'); //removes the blue
  $('video')[0].currentTime = 0; //restarts the video to beginning
  }
}

function invert () {
  $('.play').css('filter','invert(100%)');
  $('.guitarist').attr('src', 'guitarist.gif');
}

function deinvert () {
  $('.play').css('filter','');
  $('.guitarist').attr('src', 'guitarist.jpg');
}

//CLICK EVENT LISTENERS
$('.play').click(playMusic); //Music only plays when button is clicked.
$('.play').hover(invert,deinvert)
$('.submit').click(checkValue); //Submit value: Resets input, stops music

//EXECUTIONS UPON LOAD
shuffle(songs);


});
