// importing Tone.js
// creating synth class
export default class Synth {
    constructor(ctx, midiNote, velocity, maxGain, envArray, vibrato) {
        this.ctx = ctx;
        this.midiNote = midiNote;
        this.velocity = velocity;
        this.envArray = envArray; //contains both amplitude and filter envelopes

        this.maxGain = maxGain;
        this.maxGain = 0.2;      // maximum loudness (one note)
        // --- --- --- SWITCHTED TO ALL TONE.JS AUDIO NODES --- --- ---
        // --- --- ---

    this.vibAmount = vibrato;
    document.querySelector("#vibratoAmount").addEventListener("input", (event)=>{
    document.querySelector("#vibratoAmountValue").textContent = `${event.target.value}`
        this.vibAmount = Number(event.target.value);
        this.vibLFO.max = this.vibAmount;
        this.vibLFO.min = -this.vibAmount;
        this.vibLFO.frequency.value = 5 + ((0.1*Number(event.target.value))/2); 
    });

        Tone.setContext(this.ctx);
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

        this.convolver = new Tone.Convolver("IR files/celloIR(cello3_eqed_dc).wav"); // new convolver node with IR file inside buffer
        this.convolver.wet = 1.;

        // Individual filters for the violin's formant hill / "bridge hill"
        this.filter1 = new Tone.Filter(1700, "highshelf");
        this.filter2 = new Tone.Filter(2500, "peaking");
        // Set initial gains (in dB)
        this.filter1.gain.value = 6;
        this.filter2.gain.value = 12;

        this.ampEnv = new GainNode(this.ctx);   // vanilla javascript audio node

        this.osc.connect(this.convolver).connect(this.filter1);
        this.convolver.connect(this.filter2);
        Tone.connect(this.filter1, this.ampEnv);
        Tone.connect(this.filter2, this.ampEnv);

    }

    mtof(midiNote) {
        return 440 * 2 ** ((midiNote-69)/12);
    }

    start(midiNote, velocity) {
        const now = this.ctx.currentTime;
        const peakAmp = velocity/127 * this.maxGain;    // using velocity of each note to calculate percent of max gain

        //ADSR ramp !
        //running time variable for Amplitude
        let tAmp = now;
        //reset the envelope...
        this.ampEnv.gain.cancelScheduledValues(now);
        this.ampEnv.gain.setValueAtTime(0, now); 
        // iterate thru array --- ramp to the % of peakAmp value over duration 
        // release stage is handled by synth.stop(), only up to the second to last element in array
        for (let i=0; i < this.envArray.length - 1; i++) {
        this.ampEnv.gain.linearRampToValueAtTime(peakAmp * this.envArray[i][0], tAmp);
        tAmp += this.envArray[i][3]
        };
       
        //Filter center freq envelope !
        //running time variable for Filter1
        let tFilt1 = now;
        //reset the envelope...
        this.filter1.frequency.cancelScheduledValues(now);
        // iterate thru array --- ramp to the cutoff value over duration 
        // release stage is handled by synth.stop(), only up to the second to last element in array
        for (let i=0; i < this.envArray.length - 1; i++) {
        this.filter1.frequency.linearRampToValueAtTime(this.envArray[i][1], tFilt1);
        tFilt1 += this.envArray[i][3];
        };  

        //running time variable for Filter2
        let tFilt2 = now;
        //reset the envelope...
        this.filter2.frequency.cancelScheduledValues(now);
        // iterate thru array --- ramp to the cutoff value over duration 
        // release stage is handled by synth.stop(), only up to the second to last element in array
        for (let i=0; i < this.envArray.length - 1; i++) {
        this.filter2.frequency.linearRampToValueAtTime(this.envArray[i][2], tFilt2);
        tFilt2 += this.envArray[i][3];
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