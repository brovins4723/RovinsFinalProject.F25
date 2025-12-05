//Importing Modules
import MIDIengine from "./midi.js";
import Synth from "./synth.js";

const ctx = new AudioContext();
const master = new GainNode(ctx).gain.value = 0.5;
master.connect(ctx.destination);

const myNotes = new Array(128);         // new notes are stored in an array where index = the midi note#

const value = null
const duration = null
let articNum = 0;
let dynamicNum = 1;
let vibratoAmount = 0;
const envArray = [     // array of possible amplitude envelopes ; can be varying length
  [                     // amp envelope 1
  [0.8, 800, 3000, 0.2],
  [0.4, 800, 3000, 0.15],
  [0, 800, 3000, 0.4],
  ],
  [                     // amp envelope 2
  [0.8, 800, 3000, 0.2],
  [0.4, 800, 3000, 0.15],
  [0, 800, 3000, 0.4],
  ],
  [                     // amp envelope 3
  [0.8, 800, 3000, 0.2],
  [0.4, 800, 3000, 0.15],
  [0, 800, 3000, 0.4],
  ],
  [                     // amp envelope 4
  [0.8, 800, 3000, 0.2],
  [0.4, 800, 3000, 0.15],
  [0, 800, 3000, 0.4],
  ],
  [                     // amp envelope 5
  [0.8, 800, 3000, 0.2],
  [0.4, 800, 3000, 0.15],
  [0, 800, 3000, 0.4],
  ]
];

    let vibAmount = 0;
       
    document.querySelector("#vibratoAmount").addEventListener("input", (event)=>{
    document.querySelector("#vibratoAmountValue").textContent = `${event.target.value}`
      vibAmount = Number(event.target.value);
    });

const midi = new MIDIengine();

// paramaters note and velocity for starting a new note
midi.onNoteOn = (note, velocity) => {
    myNotes[note] = new Synth(ctx, note, velocity, envArray[articNum], vibAmount);   // passing note and velocity as parameters for a new synth note... also using the ADSR array as a parameter
    myNotes[note].ampEnv.connect(master);      // connect the envelope (gain node of Synth) to the master
    myNotes[note].start(note, velocity);
    console.log("start");
}
midi.onNoteOff = (note) => {
    myNotes[note].stop();
    console.log("stop :(");
}

// resumes the audio context when button clicks
const startButton = document.querySelector("#startButton");
startButton.addEventListener('click', () => {
  ctx.resume();
  console.log("click!");
})
const stopButton = document.querySelector("#stopButton");
stopButton.addEventListener('click', () => {
  ctx.suspend();
  console.log("clickz");
})


// --- --- --- also master gain slider
document.querySelector("#masterGain").addEventListener("input", (event)=>{
    document.querySelector("#masterGainValue").textContent = `${event.target.value}`
    master.gain.value = Number(event.target.value);
});
// document.querySelector("#vibratoAmount").addEventListener("input", (event)=>{
//     document.querySelector("#vibratoAmountValue").textContent = `${event.target.value}`
//     vibratoAmount = Number(event.target.value);
// });

// --- --- --- articulation selector buttonz
const artic1 = document.getElementById('artic1');
const artic2 = document.getElementById('artic2');
const artic3 = document.getElementById('artic3');
const artic4 = document.getElementById('artic4');
const artic5 = document.getElementById('artic5');
const dynamic1 = document.getElementById('dynamic1');
const dynamic2 = document.getElementById('dynamic2');
const dynamic3 = document.getElementById('dynamic3');


// Add individual listeners
artic1.addEventListener('click', () => {
  console.log('The notes will be slurred !');
  articNum = 0;
  console.log(articNum);
});

artic2.addEventListener('click', () => {
  console.log('The notes will be long and accented');
  articNum = 1;
  console.log(articNum);
});

artic3.addEventListener('click', () => {
  console.log('The notes will be short and stopped');
  articNum = 2;
  console.log(articNum);
});

artic4.addEventListener('click', () => {
  console.log('The notes will be short and off-the-string');
  articNum = 3;
  console.log(articNum);
});

artic5.addEventListener('click', () => {
  console.log('The notes will be slurred !');
  articNum = 4;
  console.log(articNum);
});

dynamic1.addEventListener('click', () => {
  dynamicNum = 0;
  console.log(dynamicNum);
});

dynamic2.addEventListener('click', () => {
  dynamicNum = 1;
  console.log(dynamicNum);
});

dynamic3.addEventListener('click', () => {
  dynamicNum = 2;
  console.log(dynamicNum);
});