/*
 * Example plugin template
 */

jsPsych.plugins["jo-play-tone"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "jo-play-tone",
    parameters: {
      freq: {
        type: jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      duration: {
        type: jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      condition: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    // display_element.innerHTML = "<img src='images/soundIcon.png'></img>"

    console.log(trial.freq, trial.condition)

    var audioContext = new AudioContext();
    var gainNode = audioContext.createGain();
    function playFrequency(frequency) {
      // create 2 second worth of audio buffer, with single channels and sampling rate of your device.
      var sampleRate = audioContext.sampleRate;
      var duration = 2*sampleRate;
      var numChannels = 1;
      var buffer  = audioContext.createBuffer(numChannels, duration, sampleRate);
      // fill the channel with the desired frequency's data
      var channelData = buffer.getChannelData(0);
      for (var i = 0; i < sampleRate; i++) {
        channelData[i]=Math.sin(2*Math.PI*frequency*i/(sampleRate));
      }
  
      // create audio source node.
      var source = audioContext.createBufferSource();
      source.buffer = buffer;
      gainNode.connect(audioContext.destination)
      source.connect(audioContext.destination);
  
      // finally start to play
      source.start(0);

      setTimeout(function(){
        gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.015);
        source.stop(0.015)
      }, trial.duration)
    }

    playFrequency(trial.freq);

    setTimeout(endTrial, trial.duration+1000)

    function endTrial(){
      // data saving
      var trial_data = {
        freq: trial.freq,
        duration: trial.duration,
      };

      // end trial
      jsPsych.finishTrial(trial_data);
    }

  };

  return plugin;
})();
