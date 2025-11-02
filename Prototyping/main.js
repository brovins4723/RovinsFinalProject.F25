//Importing Modules
import MIDIengine from "./midi.js";
import Synth from "./synth.js";

const ctx = new AudioContext();
const master = new GainNode(ctx);
master.connect(ctx.destination);

const myNotes = new Array(128);         // new notes are stored in an array where index = the midi note#
const adsr = [0.2, 0.15, 0.4, 0.5];     // storing ADSR values in a new array
        // envelope attack time (sec)
        // decay time (sec)
        // sustain level (%of max gain)
        // release time (sec)

const midi = new MIDIengine();

// paramaters note and velocity for starting a new note
midi.onNoteOn = (note, velocity) => {
    myNotes[note] = new Synth(ctx, note, velocity, adsr);   // passing note and velocity as parameters for a new synth note... also using the ADSR array as a parameter
    myNotes[note].env.connect(master);      // connect the envelope (gain node of Synth) to the master, as well as the delay node
    myNotes[note].start(note, velocity);
    console.log("start");
}
midi.onNoteOff = (note) => {
    myNotes[note].stop();
    console.log("stop :(");
}

// resumes the audio context when button clicks
const button = document.querySelector('button');
button.addEventListener('click', () => {
  ctx.resume();
  console.log("click!");
})


// --- --- ---sliders for all ADSR parameters, when slider value changes it updates the elements in ADSR array

document.querySelector("#attackSlider").addEventListener("input", (event)=>{
    document.querySelector("#attackValue").textContent = `${event.target.value} sec`
    adsr[0] = Number(event.target.value);
})
document.querySelector("#decaySlider").addEventListener("input", (event)=>{
    document.querySelector("#decayValue").textContent = `${event.target.value} sec`
    adsr[1] = Number(event.target.value);
})
document.querySelector("#sustainSlider").addEventListener("input", (event)=>{
    document.querySelector("#sustainValue").textContent = `${event.target.value}`
    adsr[2] = Number(event.target.value);
})
document.querySelector("#releaseSlider").addEventListener("input", (event)=>{
    document.querySelector("#releaseValue").textContent = `${event.target.value} sec`
    adsr[3] = Number(event.target.value);
})


// --- --- --- also master gain slider
document.querySelector("#masterGain").addEventListener("input", (event)=>{
    document.querySelector("#masterGainValue").textContent = `${event.target.value}`
    master.gain.value = Number(event.target.value);
})

// --- --- --- articulation selector buttonz
const artic1 = document.getElementById('artic1');
const artic2 = document.getElementById('artic2');
const artic3 = document.getElementById('artic3');
const artic4 = document.getElementById('artic4');


// Add individual listeners
artic1.addEventListener('click', () => {
  console.log('The notes will be slurred !');
});

artic2.addEventListener('click', () => {
  console.log('The notes will be long and accented');
});

artic3.addEventListener('click', () => {
  console.log('The notes will be short and stopped');
});

artic4.addEventListener('click', () => {
  console.log('The notes will be short and off-the-string');
});