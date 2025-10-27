
## Project Description 
The synthesizer is a web-based tool desigend to produce convincing string section sounds, modeling the expressive ability of a human string player in the way that each note begins and transitions to the next. Unlike a sample-based string plugin, this instrument will produce more authentic articulations such as staccato, legato, detache, and sforzando with a synthezied string sound. The synthesizer should have a useful interface which encourages to experimentation, allowing the user to shape the sound to their liking. 

## Use cases
> The user may use the software to perform a MIDI input (live or pre-programmed)
> The user should be able to select between articulation types / bowing styles mid performance
> The user is able to adjust how notes transition (release times, slurs, bow off-the-string, stopping the bow on the string)
> The user is able to adjust the tone of the instruments (brightness or size of the string section)
> The software should be able to handle live playback as well as record and export audio

## System requirements
> Responds to MIDI input or live MIDI performance
> Produces real-time audio
> Ability to export an audio file of performance
> Select between articulation modes during a performance / playback
> Individual control over envelope paramaters for each articulation (ADSR)
>

# Constraints and limitations
> The instrument shouldn't be limited to just one articulation type through an entire composition. The user should be able to specify any articulation mode from one note to the next. However, if the system is only using a pre-programmed MIDI input, I'm unsure how the system will differentiate between the desired articulations. Maybe the channel number is used to designate which style is being performed? Or maybe live user input from a pitch wheel can be used to scroll through articulation choices?
> How will the instrument remember which articulation to use? Should there be a way to program the articulation type from within the software?? Take an already existing MIDI performance and write one parameter to show which articulation should be used?