$(document).ready(function() {
console.log('i am ready');

//FUNCTIONS
function unblur () {
  $('.container').css('filter','none')
}

function playMusic() {
    soundTrack = new Audio("https://raw.githubusercontent.com/tongsalex/tongsalex.github.io/master/heartbreaker.mp3"); //plays audio when startpage is loaded
    soundTrack.play();
    soundTrack.loop = true;
}

function showSelected() {
  $(this).css('filter','sepia(100%)');
}

function removeSelected() {
  $('.radio').css('filter','none');
}

//EVENT LISTENERS
$(document).on("keypress", "form", function(event) { //prevents anything from happening when enter button is clicked
    return event.keyCode != 13;
});

$('.radio').click(function (event){ //directs user to different page depending ond difficulty
  console.log(event);
   diff = $(this).attr('rel');
   $('#choices').attr('action', diff);
});

$('.username').hover(unblur); // blurs the content unless hovered over
$('#easy').hover(showSelected,removeSelected); //changes color of button when clicked
$('#medium').hover(showSelected,removeSelected);
$('#hard').hover(showSelected,removeSelected);
$('.username').focus(); //places focus on text answer box

//EXECUTIONS
playMusic();

});
