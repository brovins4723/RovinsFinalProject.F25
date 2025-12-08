// importing Tone.js
// creating synth class
export default class Synth {
    constructor(ctx, midiNote, velocity, maxGain, envArray, vibrato) {
        this.ctx = ctx;
        Tone.setContext(this.ctx);

        this.midiNote = midiNote;
        this.velocity = velocity;
        this.envArray = envArray; //contains both amplitude and filter envelopes

        this.maxGain = maxGain;    // maximum loudness (one note)
        this.vibAmount = vibrato;

        // --- --- --- SWITCHTED TO ALL TONE.JS AUDIO NODES --- --- ---
        // --- --- --- 

const dynamic1 = document.getElementById('dynamic1');
const dynamic2 = document.getElementById('dynamic2');
const dynamic3 = document.getElementById('dynamic3');
dynamic1.addEventListener('click', () => {
  this.maxGain = 0.1;
});
dynamic2.addEventListener('click', () => {
  this.maxGain = 0.4;
});
dynamic3.addEventListener('click', () => {
  this.maxGain = 0.8;
});

        this.freq = this.mtof(this.midiNote)

        this.osc = new Tone.Oscillator(this.freq, "sawtooth");
        // this.osc1 = new Tone.Oscillator(this.mtof(this.midiNote+0.1), "sawtooth");
        // this.osc2 = new Tone.Oscillator(this.mtof(this.midiNote-0.1), "sawtooth");
        // this.osc3 = new Tone.Oscillator(this.mtof(this.midiNote-0.3), "sawtooth");

        this.vibLFO = new Tone.LFO({
            frequency: 4,       // vibrato rate
            min: -this.vibAmount,           // vibrato depth (in cents)
            max: +this.vibAmount,           // vibrato depth (in cents)
            amplitude: 1       
        });
       
        // Start LFO immediately (does it need to happen in the start method?)(no! it should be running continuously!)
        this.vibLFO.start();
        // Connect LFO to the oscillator freq value  
        this.vibLFO.connect(this.osc.detune);
        
    document.querySelector("#vibratoAmount").addEventListener("input", (event)=>{
    document.querySelector("#vibratoAmountValue").textContent = `${event.target.value}`
        this.vibAmount = Number(event.target.value);
        this.vibLFO.max = this.vibAmount;
        this.vibLFO.min = -this.vibAmount;
        this.vibLFO.frequency.value = 5 + ((0.1*Number(event.target.value))/2); 
    });

        this.convolver = new Tone.Convolver("IR files/violinIR(violin3_dc).wav"); // new convolver node with IR file inside buffer
        this.convolver.wet = 1.;

        // Individual filters for the violin's formant hill / "bridge hill"
        this.filter1 = new Tone.Filter(1700, "highshelf");
        this.filter2 = new Tone.Filter(2500, "peaking");
       // this.fillpFilterter2 = new Tone.Filter(2500, "highshelf");

        // Set initial gains (in dB)
        this.filter1.gain.value = 6;
        this.filter2.gain.value = 12;
        //this.lpFilter.gain.value = 12;

        this.ampEnv = new GainNode(this.ctx);   // vanilla javascript audio node

        this.osc.connect(this.convolver).connect(this.filter1);
        this.filter1.connect(this.filter2);
        Tone.connect(this.filter2, this.ampEnv);

    }

    mtof(midiNote) {
        return 440 * 2 ** ((midiNote-69)/12);
    }

    start(midiNote, velocity) {
        const now = this.ctx.currentTime;
        this.velocityAmp = velocity/127
        this.peakAmp = this.velocityAmp * this.maxGain;    // using velocity of each note to calculate percent of max gain

        //ADSR ramp !
        //running time variable for Amplitude
        let t = now;
        //reset the envelopes...
        this.ampEnv.gain.cancelScheduledValues(now);
        this.ampEnv.gain.setValueAtTime(0,now);
        this.filter1.gain.cancelScheduledValues(now);
        this.filter2.gain.cancelScheduledValues(now);
        // iterate thru array --- ramp to the % of peakAmp value over duration 
        // release stage is handled by synth.stop(), only up to the second to last element in array
        for (let i=0; i < this.envArray.length -1; i++) {
            this.ampValue = this.envArray[i][0];
            this.filt1 = this.envArray[i][1];
            this.filt2 = this.envArray[i][2];
            this.duration = this.envArray[i][3]; 

            t += this.duration;

            this.ampEnv.gain.linearRampToValueAtTime(this.peakAmp * this.ampValue, t);
            this.filter1.gain.linearRampToValueAtTime(this.filt1, t);
            this.filter2.gain.linearRampToValueAtTime(this.filt2, t);
        };
        
        //start the oscillator
        this.osc.start(now);
        // Tone.start(); // ensures audio context is resumed

    }
    stop() {
        const now = this.ctx.currentTime;

        //reset the envelope...
        this.ampEnv.gain.cancelScheduledValues(now);
        this.ampEnv.gain.setValueAtTime(this.ampEnv.gain.value, now);
        //release stage --- ramp down to 0 amplitude over the release duration
        this.ampEnv.gain.linearRampToValueAtTime(this.envArray[this.envArray.length-1][0], now + this.envArray[this.envArray.length-1][3]);

        // release stage for filter envelope
        this.filter1.frequency.linearRampToValueAtTime(this.envArray[this.envArray.length-1][1], now + this.envArray[this.envArray.length-1][3]);
        this.filter2.frequency.linearRampToValueAtTime(this.envArray[this.envArray.length-1][2], now + this.envArray[this.envArray.length-1][3]);

        //stop the oscillator
        this.osc.stop(now + this.envArray[this.envArray.length-1][3]);
    }
};