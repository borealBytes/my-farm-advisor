# MIDI Format Guide

## What is MIDI?

MIDI (Musical Instrument Digital Interface) represents music as events (note on/off, velocity, timing) rather than audio samples. It's like sheet music for computers.

## Benefits Over Audio Files

| Aspect          | MIDI                | MP3/WAV         |
| --------------- | ------------------- | --------------- |
| Size            | 1-10 KB             | 3-5 MB          |
| Editable        | ✅ Yes              | ❌ No           |
| Scalable        | ✅ Change tempo/key | ❌ Fixed        |
| Copyright       | ✅ New composition  | ⚠️ May infringe |
| Version Control | ✅ Text             | ❌ Binary       |

## File Structure

### Header Section

```midi
# Song metadata
Track: "Song Name"
Tempo: 120          # BPM
Time: 4/4           # Time signature
Key: C Major        # Musical key
Instrument: Piano   # Default instrument
```

### Note Events

```midi
# Note specification
Measure 1:
C4 quarter velocity=64    # Middle C, quarter note
E4 quarter velocity=64    # E above middle C
G4 quarter velocity=64    # G above middle C
```

## Note Names and MIDI Values

| Note  | Octave | MIDI Value | Frequency (Hz) |
| ----- | ------ | ---------- | -------------- |
| C     | 3      | 48         | 130.81         |
| C#    | 3      | 49         | 138.59         |
| D     | 3      | 50         | 146.83         |
| D#    | 3      | 51         | 155.56         |
| E     | 3      | 52         | 164.81         |
| F     | 3      | 53         | 174.61         |
| F#    | 3      | 54         | 185.00         |
| G     | 3      | 55         | 196.00         |
| G#    | 3      | 56         | 207.65         |
| A     | 3      | 57         | 220.00         |
| A#    | 3      | 58         | 233.08         |
| B     | 3      | 59         | 246.94         |
| **C** | **4**  | **60**     | **261.63**     |
| C#    | 4      | 61         | 277.18         |
| D     | 4      | 62         | 293.66         |
| D#    | 4      | 63         | 311.13         |
| E     | 4      | 64         | 329.63         |
| F     | 4      | 65         | 349.23         |
| F#    | 4      | 66         | 369.99         |
| G     | 4      | 67         | 392.00         |
| G#    | 4      | 68         | 415.30         |
| A     | 4      | 69         | 440.00         |
| A#    | 4      | 70         | 466.16         |
| B     | 4      | 71         | 493.88         |
| C     | 5      | 72         | 523.25         |

## Durations (Ticks)

Standard: 480 ticks per quarter note

| Duration       | Ticks | Note Type |
| -------------- | ----- | --------- |
| Whole          | 1920  | 1/1       |
| Dotted Half    | 1440  | 3/8       |
| Half           | 960   | 1/2       |
| Dotted Quarter | 720   | 3/16      |
| Quarter        | 480   | 1/4       |
| Dotted Eighth  | 360   | 3/32      |
| Eighth         | 240   | 1/8       |
| Sixteenth      | 120   | 1/16      |
| 32nd           | 60    | 1/32      |

## Velocity (Loudness)

| Velocity | Description |
| -------- | ----------- |
| 0        | Off/Silent  |
| 1-31     | Very quiet  |
| 32-63    | Quiet       |
| 64-95    | Medium      |
| 96-127   | Loud        |

## In Markdown

Embed MIDI notation in markdown:

````markdown
## Simpsons Theme Excerpt

```midi
Track: Simpsons Theme
Tempo: 160
Key: C Major

Measure 1:
C4 eighth velocity=100
E4 eighth velocity=100
G4 eighth velocity=100
C5 eighth velocity=100
```
````

```

## Tools

### Playback
- **timidity** (Linux/Mac): `timidity song.midi`
- ** fluidsynth**: `fluidsynth -ni soundfont.sf2 song.midi`
- **Online**: onlinemidiplayer.com, midiworld.com

### Editing
- **MuseScore** (Free): GUI editor with MIDI export
- **Rosegarden** (Linux): MIDI sequencer
- **LMMS** (Cross-platform): Digital audio workstation

### Conversion
- To WAV: `timidity input.midi -Ow -o output.wav`
- To MP3: `timidity input.midi -Ow -o - | lame - output.mp3`

## References

- [MIDI Specification](https://www.midi.org/specifications)
- [Note to MIDI mapping](https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies)
```
