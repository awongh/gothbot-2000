var start = false;
var startButton, audioCtx;

/////////


function visualize(stream) {
  var source = audioCtx.createMediaStreamSource(stream);

  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw(timestamp) {
    if (!start) start = timestamp;
    var progress = timestamp - start;

    if (progress < 2000) {
      //requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    for(var i = 0; i < 10; i++) {
 
      var node = document.querySelector('#n'+i);
      var v = dataArray[(i+1)*8];
      //console.log( v );
      if (v > 10){
        //start animation on element
        node.style="background-color:#38ff88"
      } else {

        node.style="background-color:#000"
      }

      /*
        node.style="background-color:#fde798"
        node.style="background-color:#ff38c2"
        */
    }

  }

}


/////////

window.onload = function(){
  startButton = document.querySelector('#outer-cont');

  startButton.onclick = function(){


    // visualiser setup - create web audio api context
    audioCtx = new (window.AudioContext || webkitAudioContext)();

    //main block for doing the audio recording
    var onSuccess = function(stream) {
      visualize(stream);
    }

    var onError = function(err) {
      console.log('The following error occured: ' + err);
    }

    navigator.getUserMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    if (navigator.getUserMedia) {
      console.log('getUserMedia supported.');

      var constraints = { audio: true };
      var chunks = [];

      navigator.getUserMedia(constraints, onSuccess, onError);
    } else {
       console.log('getUserMedia not supported on your browser!');
    }



  };
};
