/**
 * jspsych-survey-html-form
 * a jspsych plugin for free html forms
 *
 * Jan Simson
 *
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins['survey-html-form'] = (function() {

  let plugin = {};

  plugin.info = {
    name: 'survey-html-form',
    description: '',
    parameters: {
      html: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'HTML',
        default: null,
        description: 'HTML formatted string containing all the input elements to display. Every element has to have its own distinctive name attribute. The <form> tag must not be included and is generated by the plugin.'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      },
      dataAsArray: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        pretty_name: 'Data As Array',
        default:  false,
        description: 'Retrieve the data as an array e.g. [{name: "INPUT_NAME", value: "INPUT_VALUE"}, ...] instead of an object e.g. {INPUT_NAME: INPUT_VALUE, ...}.'
      },
      check_blanks: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        pretty_name: 'Check for blanks',
        default:  true,
        description: 'Runs through all fields'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    let html = '';
    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-html-form-preamble" class="jspsych-survey-html-form-preamble">'+trial.preamble+'</div>';
    }

    // start form
    html += '<form id="jspsych-survey-html-form">'

    // add blank warning
    html += '<div id="jspsych-survey-html-form-warning" style="display: none"><p style="color: red">Please complete ALL the questions.</p></div>';

    // add form HTML / input elements
    html += trial.html;

    // add submit button
    html += '<input type="submit" id="jspsych-survey-html-form-next" class="jspsych-btn jspsych-survey-html-form" value="'+trial.button_label+'"></input>';

    html += '</form>'
    display_element.innerHTML = html;

    display_element.querySelector('#jspsych-survey-html-form').addEventListener('submit', function(event) {
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
      // don't submit form
      event.preventDefault();

      // measure response time
      let endTime = performance.now();
      let response_time = endTime - startTime;

      let question_data = serializeArray(this);

      if (!trial.dataAsArray) {
        question_data = objectifyForm(question_data);
      }

      if (trial.check_blanks){
          let respObj = question_data;
          let blankDetected = false;
          for (let key in respObj) {
                if (respObj[key]==""){
                    blankDetected = true;
                };
          };

          if (blankDetected == false) {
              // save data
              let trialdata = {
                "rt": response_time,
                "responses": JSON.stringify(question_data)
              };

              display_element.innerHTML = '';

              // next trial
              jsPsych.finishTrial(trialdata);
          } else {
            display_element.querySelector('#jspsych-survey-html-form-warning').setAttribute("style", "display: block");
            scroll(0,0);
          }
      } else {
          // save data
          let trialdata = {
            "rt": response_time,
            "responses": JSON.stringify(question_data)
          };

          display_element.innerHTML = '';

          // next trial
          jsPsych.finishTrial(trialdata);
      }


    });

    let startTime = performance.now();
  };

  /*!
   * Serialize all form data into an array
   * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {Node}   form The form to serialize
   * @return {String}      The serialized form data
   */
  let serializeArray = function (form) {
    // Setup our serialized data
    let serialized = [];

    // Loop through each field in the form
    for (let i = 0; i < form.elements.length; i++) {
      let field = form.elements[i];

      // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
      if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

      // If a multi-select, get all selections
      if (field.type === 'select-multiple') {
        for (let n = 0; n < field.options.length; n++) {
          if (!field.options[n].selected) continue;
          serialized.push({
            name: field.name,
            value: field.options[n].value
          });
        }
      }

      // Convert field data to a query string
      else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
        serialized.push({
          name: field.name,
          value: field.value
        });
      }
    }

    return serialized;
  };

  // from https://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery
  function objectifyForm(formArray) {//serialize data function
    let returnArray = {};
    for (let i = 0; i < formArray.length; i++){
      returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
  }

  return plugin;
})();
