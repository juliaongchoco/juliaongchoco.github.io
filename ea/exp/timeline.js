let timeline = [];

// SPONTANEITY TEST
let instructions1 = {
    type: 'jo-html-keyboard-response',
    wait_duration: 1000,
    choices: ['space'],
    stimulus: "<div style='margin: auto 0'><p>In the main experiment, you will hear a sound like this.</div>",
    prompt: "Press SPACE for a sample.",
    data: {
        subj_id: subj_name,
        test_part: 'instruct_prompt'
    }
};

let instructions2 = {
  type: 'jo-html-keyboard-response',
  wait_duration: 1000,
  choices: ['space'],
  stimulus: "<div style='margin: auto 0'><p>In a trial, you will then read a sentence describing a subjective opinion about these sounds.<br>Your task is to say whether you agree with this opinion.<br>Then an additional question will follow.<br>This additional question will be a <b>memory</b> question, so try to pay attention to the sounds as best as you can.</div>",
  prompt: "Press SPACE to continue.",
  data: {
      subj_id: subj_name,
      test_part: 'instruct_prompt'
  }
};

let instructions3 = {
  type: 'jo-html-keyboard-response',
  wait_duration: 1000,
  choices: ['a', 'l'],
  stimulus: "<div style='margin: auto 0'><p>The questions you will see will always be a yes or no question.  To indicate your response, you must press the <b>A KEY</b> for YES, and the <b>L KEY</b> for NO.<p>You will only be given 5 seconds to answer the questions -- so please try to respond as fast as you can.<br>Place your fingers on A (for yes) and L (for no) to prepare.</div>",
  prompt: "Press ONE OF THE POSSIBLE RESPONSE KEYS to begin.",
  data: {
      subj_id: subj_name,
      test_part: 'instruct_prompt'
  }
};

// let begin_expt_prompt = {
//     type: 'jo-html-keyboard-response',
//     wait_duration: 5000,
//     choices: ['space'],
//     stimulus: "<p>This task is designed to be difficult!  Sometimes, you might have a good memory for the rhythmic patterns.  Sometimes, you won't be confident at all.  This is okay.  Just give your best reproduction each time!</p><p>I know it is also difficult to stay focused for so long, especially when you are doing the same thing over and over.  But remember, the experiment will be all over in less than 30 minutes.  Please do your best to remain focused! <b>Your responses will only be useful to us if you do.</b><p>You'll get a break halfway through the experiment, so you can use that time to stretch, adjust your seat, etc.</p><p>That's it for the instructions!  You are now about to begin the experiment.  Please take a moment to get comfortable.</p><p>Place your fingers on the up and down arrow keys to prepare." +
//       "</div>",
//     prompt: "Press SPACE to begin.",
//     data: {
//       subj_id: subj_name,
//       test_part: 'instruct_prompt'
//     }
//   };

// let key_trial = function(video_name, condition){
//   var block = {
//     type: 'video-keyboard-response',
//     sources: [video_name],
//     choices: jsPsych.NO_KEYS,
//     width: screen.width*.8,
//     trial_ends_after_video: true,
//     data: {
//         subj_id: subj_name,
//         test_part: 'key_trial',
//         video_name: video_name,
//         condition: condition
//     }
//   }
//   return block;
// };

let key_trial = function(freq, condition, show_prompt, adjective){
  var block = {
    type: 'jo-play-tone',
    freq: freq,
    duration: 250,
    condition: condition,
    show_prompt: show_prompt,
    adjective: adjective,
    data: {
        subj_id: subj_name,
        test_part: 'key_trial',
        freq: freq,
        condition: condition
    }
  }
  return block;
};

let intro_audio = {
  type: 'audio-keyboard-response',
  stimulus: 'images/intro_audio.mp3',
  choices: jsPsych.NO_KEYS,
  trial_ends_after_audio: true,
  data: {
      subj_id: subj_name,
      test_part: 'fixation'
  }
};

let test_audio = {
  type: 'audio-keyboard-response',
  stimulus: 'images/test_audio.mp3',
  choices: jsPsych.NO_KEYS,
  trial_ends_after_audio: true,
  data: {
      subj_id: subj_name,
      test_part: 'fixation'
  }
};

let intro_prompt = function(adjective){
  var block = {
    type: 'html-keyboard-response',
    stimulus: '<div><span style="font-size:2vw">Each sound is ' + adjective + '.</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 2000,
    data: {
        subj_id: subj_name,
        test_part: 'fixation',
        adjective: adjective
    },
  }
  return block;
};

let intro_trial = function(trial_num, adjective){
  var block = {
    type: 'html-keyboard-response',
    stimulus: "<span style='font-size:2vw'>Each sound was " + adjective + ".</span><br><br>Do you agree?<br><br>A=YES, L=NO",
    choices: ['a', 'l'],
    response_ends_trial: true,
    trial_duration: 7000,
    data: {
        subj_id: subj_name,
        test_part: 'resp_trial',
        adjective: adjective,
        trial_num: trial_num
    },
  }
  return block;
};

let test_prompt = {
  type: 'html-keyboard-response',
  stimulus: '<div><span style="font-size:2vw">Memory test:<br>Did you just hear this sound?<p>Get ready...</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: 3000,
  data: {
      subj_id: subj_name,
      test_part: 'fixation'
  }
};

let resp_trial = function(trial_num, freq, condition){
  var block = {
    type: 'html-keyboard-response',
    stimulus: "<span style='font-size:2vw'>Did you just hear this sound?<br><br>A=YES, L=NO",
    choices: ['a', 'l'],
    response_ends_trial: true,
    trial_duration: 7000,
    data: {
        subj_id: subj_name,
        test_part: 'resp_trial',
        freq: freq,
        condition: condition,
        trial_num: trial_num
    },
    on_finish: function(data){
      data.is_correct = false
      if (data.key_press==65 & data.condition=="right"){
        data.is_correct = true
      } else if (data.key_press==76 & data.condition=="wrong"){
        data.is_correct = true
      } else if (data.key_press==76 & data.condition=="avg"){
        data.is_correct = true
      }
      saveData(subj_name, jsPsych.data.get().csv());
    }
  }
  return block;
};

let check_volume = {
  type: 'jo-adjust-volume',
  stimulus: 'images/FULLBEAT.mp3',
  choices: ['r'],
  prompt: '<p>You will now listen to a continuous sequence of tones that will keep playing on loop.<p><b>During the sequence, please adjust your volume to a comfortable level</b> -- <br>such that you are okay with not changing this anymore throughout the whole experiment.</p><p>Press <u>RETURN</u> to hear the tones.<div id="countdown"></div>',
  response_ends_trial: true,
  trial_ends_after_audio: true,
};
