$(document).ready(function() { //LOAD DOM
console.log('DOM LOADED');

//ALL VARIABLES
  //MUSIC FILES LEVEL 1
var acdc = new Audio("./medium/LedZeppelin.mp3");
var blueoystercult = new Audio("./medium/BlueOysterCult.mp3");
var boston = new Audio("./medium/boston.mp3");
var creedence = new Audio("./medium/creedence.mp3");
var jimihendrix = new Audio("./medium/jimihendrix.mp3");
var scorpions = new Audio("./medium/scorpions.mp3");
var animals = new Audio("./medium/theanimals.mp3");
var kinks = new Audio("./medium/thekinks.mp3");
var who = new Audio("./medium/thewho.mp3");
var zztop = new Audio("./medium/zztop.mp3");

  //ARRAY OF SONGS AND ANSWERS
var songs = [{
  song: acdc,
  bandname: 'ACDC'
  },
  {
    song: blueoystercult,
    bandname: 'BLUE OYSTER CULT'
  },
  {
    song: boston,
    bandname: 'BOSTON'
  },
  {
    song: creedence,
    bandname: 'CREEDENCE CLEARWATER REVIVAL'
  },
  {
    song: jimihendrix,
    bandname: 'JIMI HENDRIX'
  },
  {
    song: scorpions,
    bandname: 'SCORPIONS'
  },
  {
    song: animals,
    bandname: 'ANIMALS'
  },
  {
    song: kinks,
    bandname: 'KINKS'
  },
  {
    song: who,
    bandname: 'WHO'
  },
  {
    song: zztop,
    bandname: 'ZZ TOP'
  }];

  // ADDITIONAL VARIABLES
var score = 0; //ACTUAL SCORE
var strikes = 0; //ACTUAL STRIKES
var songNumber = 0; //CURRENT SONG IN ARRAY
var displayScore = $('.points').text(); //KEEPS ACTIVE COUNTING DISPLAY OF SCORE
var displayStrikes = $('.negativepoints').text(); //KEEPS ACTIVE COUNTING DISPLAY OF STRIKES
var modal = $('.instructionModal')[0]; //INSTRUCTION MODAL
var queryString = window.location.search; // takes the URL text
queryString = queryString.substring(1); // when the URL text is taken, this removes the '?'


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
  $('.speaker').attr('src', 'speaker.png');
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
  $('.speaker1').attr('src', 'speaker.gif'); //MAKES SPEAKERS MOVE WHEN MUSIC PLAYS
  $('.speaker2').attr('src', 'speaker.gif'); //MAKES SPEAKERS MOVE WHEN MUSIC PLAYS
}

function checkWin () { //check if player won and plays congrats video
  if (strikes == 3) {
    $('.main').remove(); //removes entire gameboard
    $('body').append("<h1 class='congrats'>You lost! Better luck next time brotha.</h1>"); //displays congrats message
    $('#bgvid').attr('src','willywonka.mp4');
    $('video').css('filter', 'blur(0px)'); //removes the blur
    $('video')[0].currentTime = 0; //restarts the video to beginning
    $('#bgvid')[0].muted = false; //unmutes the video
  }
  else if (songNumber == 10 && strikes < 3) {
    $('.main').remove(); //removes entire gameboard
    $('body').append("<h1 class='congrats'>YOU WON! You're a star!</h1>"); //displays congrats message
    $('#bgvid')[0].muted = false; //unmutes the video
    $('#bgvid')[0].volume = 0.8; //adjust volume of video
    $('video').css('filter', 'blur(0px)'); //removes the blur
    $('video')[0].currentTime = 0; //restarts the video to beginning
  }
}

function invert () { //inverts play button and also makes the rocker move by changing gif
  // $('.play').css('filter','invert(100%)');
  $('.guitarist').attr('src', 'guitarist.gif');
}

function deinvert () {
  // $('.play').css('filter','');
  $('.guitarist').attr('src', 'guitarist.jpg');
}

function closeModal (event) { //CLOSES MODAL WHEN OUTSIDE DOCUMENT IS CLICKED
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }

function openModal() { //OPENS MODAL WHEN INSTRUCTION BUTTON IS CLICKED
    modal.style.display = "block";
}

//CLICK EVENT LISTENERS
$('.play').click(playMusic); //Music only plays when button is clicked.
$('.play').hover(invert,deinvert)
$('.submit').click(checkValue); //Submit value: Resets input, stops music
$('.answer').focus(); //places focus on text answer box
$(document).click(closeModal); //closes modal when document is clicked
$('.myBtn').click(openModal);//opens modal when instruction button is clicked

//EXECUTIONS UPON LOAD
shuffle(songs);

//

var parseQueryString = function( queryString ) { // loop that takes the URL and separates into an array
    var params = {}
    var queries;
    var temp;
    var l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for (var i = 0; i < queries.length; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1]; // splits array values again and assigns it to keys and values
    }
    return params;
};
var object = parseQueryString(queryString); // parseQueryString creates the object which is assigned to variable object

$('.playername').text(object.FirstName); // replaces text in the paragraph with the object values.




});
