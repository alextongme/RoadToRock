$(document).ready(function() {
console.log('i am ready');

function unblur () {
  $('.container').css('filter','none')
}

function reblur () {
  $('.container').css('filter','blur(10px)')
}

$('.container').hover(unblur, reblur)

function playMusic() {
    soundTrack = new Audio("heartbreaker.mp3"); //plays audio when startpage is loaded
    soundTrack.play();
}

playMusic();


});
