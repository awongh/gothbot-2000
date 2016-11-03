var start = false;
var startButton, audioCtx, thresholdInput;
var threshold = 160;
var currentColor = 0;
var colors = [
  "00ff14",
  "00a1ff",
  "f00",
  "fbff00",
  "ff9900",
  "ff00f7"
];

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
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    for(var i = 0; i < 10; i++) {
 
      var node = document.querySelector('#n'+i);
      var x = (i+1) * 8;
      var v = dataArray[x];
      if (v > threshold){
        //start animation on element
        node.style="background-color:#"+colors[currentColor];
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

  thresholdInput = document.querySelector('#threshold');
  thresholdInput.onchange = function(event){
    threshold = event.target.value;
  }

  startButton.onclick = function(){
    if( currentColor == colors.length -1 ){

      currentColor = 0;
    }else{
      currentColor++;
    }
  };

  // visualiser setup - create web audio api context
  audioCtx = new (window.AudioContext)();

  //main block for doing the audio recording
  var onSuccess = function(stream) {
    visualize(stream);
  }

  var onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.getUserMedia = ( navigator.getUserMedia  )

  if (navigator.getUserMedia) {
    console.log('getUserMedia supported.');

    var constraints = { audio: true };
    var chunks = [];

    navigator.getUserMedia(constraints, onSuccess, onError);
  } else {
     console.log('getUserMedia not supported on your browser!');
  }



};
