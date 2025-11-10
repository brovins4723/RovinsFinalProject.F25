//Importing Modules
import MIDIengine from "./midi.js";
import Synth from "./synth.js";

const ctx = new AudioContext();
const master = new GainNode(ctx);
master.connect(ctx.destination);

const myNotes = new Array(128);         // new notes are stored in an array where index = the midi note#

const value = null
const duration = null
let articNum = 0
const adsrArray = [     // array of possible amplitude envelopes ; can be varying length
  [                     // amp envelope 1
  [1, 0.5],
  [0.2, 0.3],
  [0.2, 0.2],
  [0, 0.2],
  ],
  [                     // amp envelope 2
  [1, duration],
  [value, duration],
  [value, duration],
  [value, duration],
  ],
  [                     // amp envelope 3
  [1, duration],
  [value, duration],
  [value, duration],
  [value, duration],
  ],
  [                     // amp envelope 4
  [1, duration],
  [value, duration],
  [value, duration],
  [value, duration],
  ]
];
        
const filterArray = [   // array of possible filter envelopes ; can be varying length
  [                     // filter envelope 1
  [1, duration],
  [value, duration],
  [value, duration],
  [value, duration],
  ],
  [                     // filter envelope 2
  [1, duration],
  [value, duration],
  [value, duration],
  [value, duration],
  ],
  [                     // filter envelope 3
  [1, duration],
  [value, duration],
  [value, duration],
  [value, duration],
  ],
  [                     // filter envelope 4
  [1, duration],
  [value, duration],
  [value, duration],
  [value, duration],
  ]
];

const midi = new MIDIengine();

// paramaters note and velocity for starting a new note
midi.onNoteOn = (note, velocity) => {
    myNotes[note] = new Synth(ctx, note, velocity, adsrArray[articNum], filterArray[articNum]);   // passing note and velocity as parameters for a new synth note... also using the ADSR array as a parameter
    myNotes[note].env.connect(master);      // connect the envelope (gain node of Synth) to the master
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