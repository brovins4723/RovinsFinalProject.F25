//Importing Modules
import MIDIengine from "./midi.js";
import Synth from "./synth.js";

const ctx = new AudioContext();
const master = new GainNode(ctx)
master.gain.value = 0.5;
master.connect(ctx.destination);
const lpFilter = new BiquadFilterNode(ctx, {
    type: "highshelf",
    frequency: 3300,   // center frequency of the shelf
    gain: 0            // start flat
});
lpFilter.connect(master);


const myNotes = new Array(128);         // new notes are stored in an array where index = the midi note#

const value = null
const duration = null
let articNum = 0;
let dynamicNum = 1;

const envArray = [     // array of all amplitude envelopes
  // each array = [amplitude, filter1 boost, filter2 boost, duration]
  // [                     // FIRST DRAFT
  // [0.8, 800, 3000, 0.2],
  // [0.4, 800, 3000, 0.15],
  // [0, 800, 3000, 0.4],
  // ],
  [                     // amp envelope 1 ; LEGATO
  [0.00,   6,    12,  0.00],
  [0.80,   12,   12,  0.20],   // slow bow-attack
  [0.65,   6,   10,   0.10],   // slight decay
  [0.60,   6,   9,    0.40],   // sustain plateau
  [0.00,   6,   9,    0.20]    // soft release
  ],
  [                     // amp envelope 2 ; STACCATO
  [0.00,   6,    12,     0.00],
  [0.90,   13,    16,    0.02],  // bite
  [0.40,   10,    14,    0.04],  // quick decay
  [0.20,   8,    12,     0.08],  // brief sustain
  [0.00,   6,    12,     0.05]
  ],
  [                     // amp envelope 3 ; SPICCATO
  [0.00,   6,    12,     0.00],
  [0.8,   15,    17,     0.02],  // very sharp bite from the bow impact
  [0.45,  10,    6,      0.02],   // immediate fall as bow leaves the string
  [0.00,   6,    0,      0.50],    // long ringing body resonance (release)
  [0.00,   0,    0,      0.05],    
  ],
  [                     // amp envelope 4 ; SFORZANDO
  [0.00,    6,    12,      0.00],
  [0.9,    16,     18,     0.02],   // strong accent
  [0.70,   11,     15,     0.06],   // fast fall
  [0.55,    9,     15,     0.30],   // sustain at moderate intensity
  [0.00,    0,     0,      0.25]
  ],
  [                     // amp envelope 5 ; SLURRED
  [0.00,   6,    9,     0.00],
  [0.70,   9,    13,    0.30],   // soft bow change
  [0.55,   8,    12,    0.12],
  [0.50,   7,    9,     0.50],   // very stable sustain
  [0.00,   6,    9,     0.25]
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
    myNotes[note].ampEnv.connect(lpFilter);      // connect the envelope (gain node of Synth) to the master
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
  console.log("resumed!");
})
const stopButton = document.querySelector("#stopButton");
stopButton.addEventListener('click', () => {
  ctx.suspend();
  console.log("suspend");
  for (let i = 0; i < myNotes.length-1; i++) {
  if (myNotes[i]) {
    myNotes[i].osc.stop();
    }
  }
});


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
  maxGain = 0.1;
  lpFilter.frequency.value = 2500;
  lpFilter.gain.value = -6;
});

dynamic2.addEventListener('click', () => {
  dynamicNum = 1;
  console.log(dynamicNum);
  maxGain = 0.4;
  lpFilter.frequency.value = 3300;
  lpFilter.gain.value = -6;
});

dynamic3.addEventListener('click', () => {
  dynamicNum = 2;
  console.log(dynamicNum);
  maxGain = 0.9;
  lpFilter.frequency.value = 4000;
  lpFilter.gain.value = 3;
});