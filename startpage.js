$(document).ready(function() {
console.log('i am ready');

function unblur () {
  $('.container').css('filter','none')
}

function reblur () {
  $('.container').css('filter','blur(10px)')
}

$('.start').hover(unblur, reblur)

function playMusic() {
      //creates a new rockStar from prototype in the function piece below
    soundTrack = new Audio("heartbreaker.mp3"); //plays audio when game is loaded
    soundTrack.play();
}
playMusic();

  // var vid = document.getElementById("bgvid");
  // var pauseButton = document.querySelector("#polina button");
  //
  // function vidFade() {
  //   vid.classList.add("stopfade");
  // }
  //
  // vid.addEventListener('ended', function()
  // {
  // // only functional if "loop" is removed
  // vid.pause();
  // // to capture IE10
  // vidFade();
  // });

  // pauseButton.addEventListener("click", function() {
  //   vid.classList.toggle("stopfade");
  //   if (vid.paused) {
  //     vid.play();
  //     pauseButton.innerHTML = "Pause";
  //   } else {
  //     vid.pause();
  //     pauseButton.innerHTML = "Paused";
  //   }
  // })



});
