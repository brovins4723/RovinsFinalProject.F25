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
    gain: -3           // start flat
});
lpFilter.connect(master);


const myNotes = new Array(128);         // new notes are stored in an array where index = the midi note#

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
  [0.00,   6,    9,  0.00],
  [0.60,   9,   9,  0.20],    // slow bow-attack
  [0.45,   6,   10,   0.10],   // slight decay
  [0.60,   6,   9,    0.40],   // sustain plateau
  [0.00,   6,   9,    0.40]    // soft release
  ],
  [                     // amp envelope 2 ; STACCATO
  [0.00,   6,    12,     0.00],
  [0.70,   13,    12,    0.05],  // bite??
  [0.50,   10,    9,    0.1],  // quick decay
  [0.20,   8,    6,     0.08],  // brief sustain
  [0.00,   6,    6,     0.45],
  [0.00,   0,    0,     0.55],    
  ],
  [                     // amp envelope 3 ; SPICCATO
  [0.00,   6,    12,     0.00],
  [0.7,   15,    17,     0.05],  // very sharp bite from the bow impact
  [0.3,  10,    6,      0.2],  // immediate fall as bow leaves the string
  [0.00,   6,    0,      0.50],  // long ringing body resonance (release)
  [0.00,   0,    0,      0.4],    
  ],
  [                     // amp envelope 4 ; SFORZANDO
  [0.00,    6,    12,      0.00],
  [0.8,    15,     15,    0.2],  // explosive attack - very fast, maximum brightness
  [0.6,    15,     15,     0.02],  // brief peak hold for presence
  [0.5,   12,     12,     0.1],   // dramatic fall after accent
  [0.50,    9,     12,     0.25],   // settle into sustain
  [0.00,    9,     9,      0.50]    // smooth release
  ],
  [                     // amp envelope 5 ; SLURRED
  [0.00,   6,    9,  0.00],
  [0.40,   9,   9,  0.20],    // slow bow-attack
  [0.65,   6,   10,   0.10],   // slight decay
  [0.60,   6,   9,    0.40],   // sustain plateau
  [0.00,   6,   9,    0.40]    // soft release
  ]
];

  let maxGain = 0.4;
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
  console.log('The notes will be legato !');
  articNum = 0;
  console.log(articNum);
});

artic2.addEventListener('click', () => {
  console.log('The notes will be short and stopped');
  articNum = 1;
  console.log(articNum);
});

artic3.addEventListener('click', () => {
  console.log('The notes will be short and off-the-string');
  articNum = 2;
  console.log(articNum);
});

artic4.addEventListener('click', () => {
  console.log('The notes will be long and accented');
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
  lpFilter.frequency.value = 2000;
  lpFilter.gain.value = -6;
});

dynamic2.addEventListener('click', () => {
  dynamicNum = 1;
  console.log(dynamicNum);
  maxGain = 0.4;
  lpFilter.frequency.value = 3300;
  lpFilter.gain.value = -3;
}); 

dynamic3.addEventListener('click', () => {
  dynamicNum = 2;
  console.log(dynamicNum);
  maxGain = 0.8;
  lpFilter.frequency.value = 4000;
  lpFilter.gain.value = 3;
});