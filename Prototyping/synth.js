// importing Tone.js
//import Tone from "https://unpkg.com/tone@next/build/Tone.js";

// creating synth class
export default class Synth {
    constructor(ctx, midiNote, velocity, adsr, filterEnv) {
        this.ctx = ctx;
        this.midiNote = midiNote;
        this.velocity = velocity;
        this.adsr = adsr;
        this.filterEnv = filterEnv;

        this.osc = new OscillatorNode(this.ctx);                // new oscillator node for each new Synth
        this.osc.frequency.value = this.mtof(this.midiNote);    // converting midi note input to frequency
        this.osc.type = "sawtooth";

        //this.convolver = new Tone.Convolver("/Users/brannonrovins/Desktop/~ temple ~/programming for musicians/RovinsFinalProject.F25/Prototyping/IR files/violinIR(violin3_dc).wav"); // new convolver node with IR file inside buffer

        this.ampEnv = new GainNode(this.ctx);
        this.maxGain = 0.2;      // maximum loudness (one note)
        

        this.filter = new BiquadFilterNode(this.ctx);
        this.filter.type = "lowpass";
        this.filter.frequency.value = 2000;

        this.osc.connect(this.filter).connect(this.ampEnv);
        //this.osc.connect(this.convolver).connect(this.filter).connect(this.ampEnv);

    }
    mtof() {
        return 440 * 2 ** ((this.midiNote-69)/12);
    }
    start(midiNote, velocity) {
        const now = this.ctx.currentTime;
        const peakAmp = velocity/127 * this.maxGain;    // using velocity of each note to calculate percent of max gain

        //ADSR ramp !
        //reset the envelope...
        this.ampEnv.gain.cancelScheduledValues(now);
        this.ampEnv.gain.setValueAtTime(0, now); 
        //iterate thru array --- ramp to the % of peakAmp value over duration 
        for (let i=0; i < this.adsr.length - 2; i++) {
        this.ampEnv.gain.linearRampToValueAtTime(peakAmp * this.adsr[i][0], now + this.adsr[i][1]);
        }
       
        //Filter cutoff envelope !
        //reset the envelope...
        this.filter.frequency.cancelScheduledValues(now);
        this.filter.frequency.setValueAtTime(0, now); 
        //iterate thru array --- ramp to the cutoff value over duration 
        for (let i=0; i < this.filterEnv.length - 2; i++) {
        this.filter.frequency.linearRampToValueAtTime(this.filterEnv[i][0], now + this.filterEnv[i][1]);
        }
        
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
        this.osc.stop(now + this.adsr[this.adsr.length-2][1]);
    }
}