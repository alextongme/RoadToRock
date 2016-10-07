$(document).ready(function() {
console.log('i am ready');

//FUNCTIONS
function unblur () {
  $('.container').css('filter','none')
}

function reblur () {
  $('.container').css('filter','blur(10px)')
}

function playMusic() {
    soundTrack = new Audio("heartbreaker.mp3"); //plays audio when startpage is loaded
    soundTrack.play();
    soundTrack.loop = true;
}

//EVENT LISTENERS
$('.radio').click(function (event){ //directs user to different page depending ond difficulty
  console.log(event);
   diff = $(this).attr('rel');
   $('#choices').attr('action', diff);
});

$('.container').hover(unblur, reblur) // blurs the content unless hovered over

//EXECUTIONS
playMusic();


});
