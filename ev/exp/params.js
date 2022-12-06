let expt_name = "";
let subj_id = prompt("Please enter your 8-digit PENN ID:", "");
let subj_name = expt_name + "_" + subj_id.toString();
let consent_duration = 10;
let consent_pay = "$" + (consent_duration * .12).toFixed(2).toString();
let completion_code = '87FFAA9F';

let shortVersion = false;
let show_boilerplate = true;
let forceFullscreen = true;
let limitToDesktop = true;
let limitToGoogle = false;