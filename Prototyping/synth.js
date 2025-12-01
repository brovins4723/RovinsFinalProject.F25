// importing Tone.js
// creating synth class
export default class Synth {
    constructor(ctx, midiNote, velocity, adsr, filterEnv, vibAmount) {
        this.ctx = ctx;
        this.midiNote = midiNote;
        this.velocity = velocity;
        this.adsr = adsr;
        this.filterEnv = filterEnv;
        this.vibAmount = vibAmount

        this.maxGain = 0.2;      // maximum loudness (one note)

        // --- --- --- SWITCHTED TO ALL TONE.JS AUDIO NODES --- --- ---
   
        // --- --- ---

        Tone.setContext(this.ctx);
        this.freq = this.mtof(this.midiNote)

        this.osc = new Tone.Oscillator(this.freq, "sawtooth");
        // this.osc1 = new Tone.Oscillator(this.mtof(this.midiNote+0.1), "sawtooth");
        // this.osc2 = new Tone.Oscillator(this.mtof(this.midiNote-0.1), "sawtooth");
        // this.osc3 = new Tone.Oscillator(this.mtof(this.midiNote-0.3), "sawtooth");

        this.vibLFO = new Tone.LFO({
            frequency: 4,     // vibrato rate
            amplitude: 15,    // vibrato width (in cents)(10-25cents)
        });
         // Connect LFO to the oscillator freq value
        this.vibLFO.connect(this.osc.detune);
        // Start LFO immediately (does it need to happen in the start method?)(no! it should be running continuously!)
        this.vibLFO.start();

       


        this.convolver = new Tone.Convolver("IR files/celloIR(cello3_eqed_dc).wav"); // new convolver node with IR file inside buffer
        this.convolver.wet = 1.;
        this.filter = new Tone.Filter(2000, "lowpass");
        this.ampEnv = new GainNode(this.ctx);   // vanilla javascript audio node

        this.osc.connect(this.convolver).connect(this.filter);
        Tone.connect(this.filter, this.ampEnv);
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
        for (let i=0; i < this.adsr.length - 1; i++) {
        this.ampEnv.gain.linearRampToValueAtTime(peakAmp * this.adsr[i][0], tAmp);
        tAmp += this.adsr[i][1]
        };
       
        //Filter cutoff envelope !
        //running time variable for Filter
        let tFilt = now;
        //reset the envelope...
        this.filter.frequency.cancelScheduledValues(now);
        this.filter.frequency.setValueAtTime(0, now); 
        // iterate thru array --- ramp to the cutoff value over duration 
        // release stage is handled by synth.stop(), only up to the second to last element in array
        for (let i=0; i < this.filterEnv.length - 1; i++) {
        this.filter.frequency.linearRampToValueAtTime(this.filterEnv[i][0], tFilt);
        tFilt += this.filterEnv[i][1];
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
        this.ampEnv.gain.linearRampToValueAtTime(this.adsr[this.adsr.length-1][0], now + this.adsr[this.adsr.length-1][1]);

        // release stage for filter envelope
        this.filter.frequency.linearRampToValueAtTime(this.filterEnv[this.filterEnv.length-1][0], now + this.filterEnv[this.filterEnv.length-1][1]);

        //stop the oscillator
        this.osc.stop(now + this.adsr[this.adsr.length-1][1]);
    }
};