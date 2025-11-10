## Develoopment Log
As I've started work on the more detailed code for this synth, I'm finding that older pieces I built for the project are no longer working properly... 

Initially I made a super simplified version of the synth which just takes a MIDI input and plays a sawtooth wave. This was working fine and I started building the framework for the amplitude envelopes. I want these envelopes to be as detailed as possible, so instead of the ADSR array I used for my midterm project, I decided I will create an array of value pairs representing segments in the amplitude ramp. The first element will be the target value for the ramp and the second element is the duration for the ramp from one value to the next.

I needed to update my synth.start() method to incorporate this new envelope logic. For example, rather than ramp to "sustain value" over "decay time," it should now ramp to "element0" over "element1." I'm using a for loop to iterate through the array, ramping to the next value from the array. I'm hoping this allows me to make the amplitude envelopes super detailed with lots of steps / segments.

My plan was to get the convolver node working next. However now my program isn't making any sound! I've switched into troubleshooting mode to get it making sound with a simple oscillator before I dive back in to the convolver node business. 