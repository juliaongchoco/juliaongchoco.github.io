// LOAD TIMELINE
timeline.push({
    type: 'fullscreen',
    fullscreen_mode: true,
    button_label: 'Enter Fullscreen',
    message: "<p>This experiment will automatically switch into full-screen mode when you press the button below.  And once you are in full-screen mode, it is important that you do not exit it (e.g. to switch to other windows or tabs).</p><p>(Don't worry: we'll bring you back out of full-screen mode as soon as the experiment is over.)</p><br><br><br><br>",
    on_finish: function (data) {
        viewport_width = get_viewport_size().width;
        viewport_height = get_viewport_size().height;
        data.screen_width = viewport_width;
        data.screen_height = viewport_height;
        console.log("ID", subj_name, "W", viewport_width, "H", viewport_height)
    }
});
if (show_boilerplate) {
    // timeline.push(consent);
    // timeline.push(welcome_prompt);
    timeline.push(instructions1);
    // timeline.push(begin_expt_prompt);
}

// MAIN EXPERIMENT

///////////// CHANGE NUMBER OF CONDITIONS HERE ///////////
let num_per_condition = 3*3;
let num_for_right = 6*3;
let conditions = Array(num_per_condition).fill('wrong').concat(Array(num_for_right).fill('right').concat(Array(num_per_condition).fill('avg')));
let right_conditions = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2];
shuffle(right_conditions);
shuffle(conditions);

let right_ct = 0;

///// SETUP TONE TRIABS AND FREQUENCIES HERE HERE ///////
let tone_list = ["C0", "C#0", "D0", "D#0", "E0", "F0", "F#0", "G0", "G#0", "A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5", "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6", "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7", "C8", "C#8", "D8", "D#8", "E8", "F8", "F#8", "G8", "G#8", "A8", "A#8", "B8"];
let tone_dict = {"C0": 16.35, "C#0": 17.32, "D0": 18.35, "D#0": 19.45, "E0": 20.6, "F0": 21.83, "F#0": 23.12, "G0": 24.5, "G#0": 25.96, "A0": 27.5, "A#0": 29.14, "B0": 30.87, "C1": 32.7, "C#1": 34.65, "D1": 36.71, "D#1": 38.89, "E1": 41.2, "F1": 43.65, "F#1": 46.25, "G1": 49, "G#1": 51.91, "A1": 55, "A#1": 58.27, "B1": 61.74, "C2": 65.41, "C#2": 69.3, "D2": 73.42, "D#2": 77.78, "E2": 82.41, "F2": 87.31, "F#2": 92.5, "G2": 98, "G#2": 103.83, "A2": 110, "A#2": 116.54, "B2": 123.47, "C3": 130.81, "C#3": 138.59, "D3": 146.83, "D#3": 155.56, "E3": 164.81, "F3": 174.61, "F#3": 185, "G3": 196, "G#3": 207.65, "A3": 220, "A#3": 233.08, "B3": 246.94, "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63, "F4": 349.23, "F#4": 369.99, "G4": 392, "G#4": 415.3, "A4": 440, "A#4": 466.16, "B4": 493.88, "C5": 523.25, "C#5": 554.37, "D5": 587.33, "D#5": 622.25, "E5": 659.25, "F5": 698.46, "F#5": 739.99, "G5": 783.99, "G#5": 830.61, "A5": 880, "A#5": 932.33, "B5": 987.77, "C6": 1046.5, "C#6": 1108.73, "D6": 1174.66, "D#6": 1244.51, "E6": 1318.51, "F6": 1396.91, "F#6": 1479.98, "G6": 1567.98, "G#6": 1661.22, "A6": 1760, "A#6": 1864.66, "B6": 1975.53, "C7": 2093, "C#7": 2217.46, "D7": 2349.32, "D#7": 2489.02, "E7": 2637.02, "F7": 2793.83, "F#7": 2959.96, "G7": 3135.96, "G#7": 3322.44, "A7": 3520, "A#7": 3729.31, "B7": 3951.07, "C8": 4186.01, "C#8": 4434.92, "D8": 4698.63, "D#8": 4978.03, "E8": 5274.04, "F8": 5587.65, "F#8": 5919.91, "G8": 6271.93, "G#8": 6644.88, "A8": 7040, "A#8": 7458.62, "B8": 7902.13}

let tone_triad;
let tone_freqs;
let tone_distance = 7;
let foil_distance = 12;

function getAvg(grades) {
  const total = grades.reduce((acc, c) => acc + c, 0);
  return total / grades.length;
}

for (i=0; i<conditions.length; i++){

  main_tone_id = get_random_value(range(13, 95));
  other_tones_id = [main_tone_id-tone_distance, main_tone_id+tone_distance];
  foil_tone_id = main_tone_id-foil_distance;

  tone_triad = [tone_list[main_tone_id], tone_list[other_tones_id[0]], tone_list[other_tones_id[1]]];
  tone_freqs = [tone_dict[tone_triad[0]], tone_dict[tone_triad[1]], tone_dict[tone_triad[2]]];

  shuffle(tone_freqs)

  timeline.push(intro_prompt);

  // PLAY TRIAD
  for (n=0; n<3; n++){
    timeline.push(key_trial(tone_freqs[n], conditions[i]));
  }

console.log("testing")
//timeline.push(intro_trial());

timeline.push(test_prompt);

  // PLAY TEST
  if (conditions[i]=='right'){
    test_tone = tone_freqs[right_conditions[right_ct]];
    right_ct += 1;
  } else if (conditions[i]=='wrong'){
    test_tone = tone_dict[tone_list[foil_tone_id]];
  } else {
    test_tone = getAvg([tone_freqs[0], tone_freqs[1], tone_freqs[2]]);
  }

  console.log("printing test tone", test_tone, conditions[i])

  timeline.push(key_trial(test_tone, conditions[i]));

  // RESPONSE
  timeline.push(resp_trial(test_tone, conditions[i]));
  timeline.push(blank);

}

// DEBRIEFING SECTION
timeline.push({
    type: 'fullscreen',
    fullscreen_mode: false,
    button_label: 'Exit Fullscreen',
    message: '<p>You can now exit full screen mode.</p>',
    on_finish: function (data) {
        viewport_width = get_viewport_size().width;
        viewport_height = get_viewport_size().height;
        data.screen_width = viewport_width;
        data.screen_height = viewport_height;
        console.log("ID", subj_name, "W", viewport_width, "H", viewport_height)
    }
});
// timeline.push(check_debrief_response);
// timeline.push(get_code_prompt);
// timeline.push(show_code_prompt);
timeline.push(close_prompt);
console.log(timeline);


// START EXPERIMENT
if (limitToGoogle) {
    let browserInfo = getBrowserInfo();
    if (browserInfo.browser !== 'Chrome') {
      Message = "This experiment is only supported by Google Chrome. Please reopen the experiment in Google Chrome."
      let wrong_browser = {
        type: 'html-keyboard-response',
        stimulus: ['<p style="font-size: 26px;">' + Message + '</p>'],
        choices: jsPsych.NO_KEYS,
      };
      jsPsych.init({
        timeline: [wrong_browser]
      });
    } else {
      if (limitToDesktop) {
        let mobileCheck = mobileAndTabletCheck();
        if (mobileCheck) {
          Message =
            "This experiment is only supported by desktop browsers, and cannot be run on a tablet or a phone. Please reopen the experiment in a desktop browser.  If you can only use a tablet or a phone, and are unable to switch to a desktop browser, please quit the experiment and return the HIT."
          let wrong_browser = {
            type: 'html-keyboard-response',
            stimulus: ['<p style="font-size: 26px;">' + Message + '</p>'],
            choices: jsPsych.NO_KEYS,
          };
          jsPsych.init({
            timeline: [wrong_browser]
          });
        } else if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
            .test(navigator.userAgent) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
            .test(navigator.userAgent.substr(0, 4))) {
          Message =
            "This experiment is only supported by desktop browsers, and cannot be run on a tablet or a phone. Please reopen the experiment in a desktop browser.  If you can only use a tablet or a phone, and are unable to switch to a desktop browser, please quit the experiment and return the HIT."
          let wrong_browser = {
            type: 'html-keyboard-response',
            stimulus: ['<p style="font-size: 26px;">' + Message + '</p>'],
            choices: jsPsych.NO_KEYS,
          };
          jsPsych.init({
            timeline: [wrong_browser]
          });
        } else {
          let mobile_prompt = {
            type: 'html-keyboard-response',
            choices: ['space'],
            stimulus: '<p>This experiment requires you to be using a desktop browser. The program should have automatically detected whether you are using a phone or a tablet.<p><strong>If you are using a phone or tablet and it has still allowed you to continue, please reopen the experiment in a desktop browser now.</strong><p>If you can only use a tablet or a phone, and are unable to switch to a desktop browser, please quit the experiment and return the HIT.</p><p>If you are on a desktop browser -- great!  Press the spacebar to continue.</p>'
          };
          startExpt();
        };
      } else {
        startExpt();
      };
    }
  } else {
    if (limitToDesktop) {
      let mobileCheck = mobileAndTabletCheck();
      if (mobileCheck) {
        Message =
          "This experiment is only supported by desktop browsers, and cannot be run on a tablet or a phone. Please reopen the experiment in a desktop browser.  If you can only use a tablet or a phone, and are unable to switch to a desktop browser, please quit the experiment and return the HIT."
        let wrong_browser = {
          type: 'html-keyboard-response',
          stimulus: ['<p style="font-size: 26px;">' + Message + '</p>'],
          choices: jsPsych.NO_KEYS,
        };
        jsPsych.init({
          timeline: [wrong_browser]
        });
      } else if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
          .test(navigator.userAgent) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
          .test(navigator.userAgent.substr(0, 4))) {
        Message =
          "This experiment is only supported by desktop browsers, and cannot be run on a tablet or a phone. Please reopen the experiment in a desktop browser.  If you can only use a tablet or a phone, and are unable to switch to a desktop browser, please quit the experiment and return the HIT."
        let wrong_browser = {
          type: 'html-keyboard-response',
          stimulus: ['<p style="font-size: 26px;">' + Message + '</p>'],
          choices: jsPsych.NO_KEYS,
        };
        jsPsych.init({
          timeline: [wrong_browser]
        });
      } else {
        let mobile_prompt = {
          type: 'html-keyboard-response',
          choices: ['space'],
          stimulus: '<p>This experiment requires you to be using a desktop browser. The program should have automatically detected whether you are using a phone or a tablet.<p><strong>If you are using a phone or tablet and it has still allowed you to continue, please reopen the experiment in a desktop browser now.</strong><p>If you can only use a tablet or a phone, and are unable to switch to a desktop browser, please quit the experiment and return the HIT.</p><p>If you are on a desktop browser -- great!  Press the spacebar to continue.</p>'
        };
        startExpt();
      };
    } else {
      startExpt();
    };
  }
