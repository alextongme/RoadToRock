$(document).ready(function() { //LOAD DOM
console.log('i am ready');

function unblur () {
  $('.container').css('filter','none')
}

function reblur () {
  $('.container').css('filter','blur(10px)')
}

$('.start').hover(unblur, reblur)

});
