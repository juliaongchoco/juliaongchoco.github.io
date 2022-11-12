let timeline = [];

// SPONTANEITY TEST
let instructions1 = {
    type: 'jo-html-keyboard-response',
    wait_duration: 1000,
    choices: ['space'],
    stimulus: "<div style='margin: auto 0'><p>In this experiment, you will complete the same task multiple times.<br>Each time, you will hear three different tones.<br>Afterwards, you will hear a single tone.<p>Your task is simply to determine whether the single tone was in the previous set of three tones that you heard.</div>",
    prompt: "Press SPACE to continue.",
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

let key_trial = function(freq, condition){
  var block = {
    type: 'jo-play-tone',
    freq: freq,
    duration: 250,
    condition: condition,
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

let intro_prompt = {
  type: 'html-keyboard-response',
  stimulus: '<div>Each tone is pleasant.</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: 2000,
  data: {
      subj_id: subj_name,
      test_part: 'fixation'
  }
};

let intro_trial = function(){
  var block = {
    type: 'html-keyboard-response',
    stimulus: "Each tone is pleasant.<br>Y=YES, N=NO",
    choices: ['y', 'n'],
    response_ends_trial: true,
    data: {
        subj_id: subj_name,
        test_part: 'resp_trial'
    },
  }
  return block;
};

let test_prompt = {
  type: 'html-keyboard-response',
  stimulus: '<div>Did you just hear this tone?</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: 2000,
  data: {
      subj_id: subj_name,
      test_part: 'fixation'
  }
};

let resp_trial = function(freq, condition){
  var block = {
    type: 'html-keyboard-response',
    stimulus: "Did you just hear this tone?<br>Y=YES, N=NO",
    choices: ['y', 'n'],
    response_ends_trial: true,
    data: {
        subj_id: subj_name,
        test_part: 'resp_trial',
        freq: freq,
        condition: condition
    },
    on_finish: function(data){
      data.is_correct = false
      if (data.key_press==89 & data.condition=="right"){
        data.is_correct = true
      } else if (data.key_press==78 & data.condition=="wrong"){
        data.is_correct = true
      } else if (data.key_press==78 & data.condition=="avg"){
        data.is_correct = true
      }
      saveData(subj_name, jsPsych.data.get().csv());
    }
  }
  return block;
};
