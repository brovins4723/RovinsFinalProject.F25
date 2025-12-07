//Importing Modules
import MIDIengine from "./midi.js";
import Synth from "./synth.js";

const ctx = new AudioContext();
const master = new GainNode(ctx)
master.gain.value = 0.5;
master.connect(ctx.destination);

const myNotes = new Array(128);         // new notes are stored in an array where index = the midi note#

const value = null
const duration = null
let articNum = 0;
let dynamicNum = 1;
let vibratoAmount = 0;
const envArray = [     // array of all amplitude envelopes
  // each array = [amplitude, filter1 boost, filter2 boost, duration]
  // [                     // FIRST DRAFT
  // [0.8, 800, 3000, 0.2],
  // [0.4, 800, 3000, 0.15],
  // [0, 800, 3000, 0.4],
  // ],
  [                     // amp envelope 1 ; LEGATO
  [0.00,   0,   0,    0.00],   // start
  [0.80,   5,   3,    0.12],   // slow bow-attack
  [0.65,   3,   2,    0.10],   // slight decay
  [0.60,   2,   1,    0.40],   // sustain plateau
  [0.00,   0,   0,    0.30]    // soft release
  ],
  [                     // amp envelope 2 ; STACCATO
  [0.00,   0,    0,     0.00],
  [0.90,   7,    4,     0.02],  // bite
  [0.40,   4,    2,     0.04],  // quick decay
  [0.20,   2,    1,     0.08],  // brief sustain
  [0.00,   0,    0,     0.05]
  ],
  [                     // amp envelope 3 ; SPICCATO
  [0.00,   0,    0,     0.00],
  [0.95,   9,    5,     0.015], // crisp ping from bow bounce
  [0.35,   5,    2,     0.03],
  [0.15,   2,    1,     0.05],
  [0.00,   0,    0,     0.04]
  ],
  [                     // amp envelope 4 ; SFORZANDO
  [0.00,    0,     0,      0.00],
  [1.10,   10,     6,      0.02],   // strong accent
  [0.70,    5,     3,      0.06],   // fast fall
  [0.55,    3,     2,      0.30],   // sustain at moderate intensity
  [0.00,    0,     0,      0.25]
  ],
  [                     // amp envelope 5 ; SLURRED
  [0.00,   0,   0,    0.00],
  [0.70,   3,   1,    0.18],   // soft bow change
  [0.55,   2,   1,    0.12],
  [0.50,   1,   1,    0.50],   // very stable sustain
  [0.00,   0,   0,    0.25]
  ]
];
  
  let maxGain = 0.2;
  let vibAmount = 0;
  document.querySelector("#vibratoAmount").addEventListener("input", (event)=>{
  document.querySelector("#vibratoAmountValue").textContent = `${event.target.value}`
    vibAmount = Number(event.target.value);
  });

const midi = new MIDIengine();

// paramaters note and velocity for starting a new note
midi.onNoteOn = (note, velocity) => {
    myNotes[note] = new Synth(ctx, note, velocity, maxGain, envArray[articNum], vibAmount);   // passing note and velocity as parameters for a new synth note... also using the ADSR array as a parameter
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