// creating synth class
export default class Synth {
    constructor(ctx, midiNote, velocity, adsr) {
        this.ctx = ctx;
        this.midiNote = midiNote;
        this.velocity = velocity;
        this.adsr = adsr;

        this.osc = new OscillatorNode(this.ctx);                // new oscillator node for each new Synth
        this.osc.frequency.value = this.mtof(this.midiNote);    // converting midi note input to frequency
        this.osc.type = "square";

        this.env = new GainNode(this.ctx);

        this.maxGain = 0.2;      // maximum loudness (one note)
        this.attack = adsr[0];   // envelope attack time (sec)
        this.decay = adsr[1];    // decay time (sec)
        this.sustain = adsr[2];  // sustain level
        this.release = adsr[3];  // release time (sec)

        this.filter = new BiquadFilterNode(this.ctx);
        this.filter.type = "lowpass";
        this.filter.frequency.value = 2000;

        this.osc.connect(this.filter).connect(this.env);

    }
    mtof() {
        return 440 * 2 ** ((this.midiNote-69)/12);
    }
    start(midiNote, velocity) {
        const now = this.ctx.currentTime;
        const peakAmp = velocity/127 * this.maxGain;    // using velocity of each note to calculate percent of max gain

        //ADSR ramp !
        //reset the envelope...
        this.env.gain.cancelScheduledValues(now);
        this.env.gain.setValueAtTime(0, now); 
        //attack stage --- ramp to the peakAmp value over attack duration 
        this.env.gain.linearRampToValueAtTime(peakAmp, now + this.attack);
        //decay stage --- ramp to the sustain value over attack + decay duration
        this.env.gain.linearRampToValueAtTime(this.sustain * peakAmp, now + this.attack + this.decay);
        //start the oscillator
        this.osc.start(now);
    }
    stop() {
        const now = this.ctx.currentTime;

        //reset the envelope...
        this.env.gain.cancelScheduledValues(now);
        this.env.gain.setValueAtTime(this.env.gain.value, now);
        //release stage --- ramp down to 0 amplitude over the release duration
        this.env.gain.linearRampToValueAtTime(0., now + this.release);
        //stop the oscillator
        this.osc.stop(now + this.release);
    }
}