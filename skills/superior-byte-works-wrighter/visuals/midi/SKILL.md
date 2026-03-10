---
name: wrighter-midi
description: MIDI audio notation for music and procedural audio
---

# MIDI Audio Notation

Text-based music representation using MIDI format.

## Why MIDI?

| Benefit                 | Description                       |
| ----------------------- | --------------------------------- |
| **1000x smaller**       | 1-10 KB vs 3-5 MB for MP3         |
| **Infinitely scalable** | Change tempo, key anytime         |
| **Editable**            | Modify notes, instruments, timing |
| **No copyright**        | New compositions, no samples      |
| **Version control**     | Text-based, diffs cleanly         |

## Format Priority

For music: **MIDI > MP3/WAV**

See [../VECTOR_FORMAT_HIERARCHY.md](../VECTOR_FORMAT_HIERARCHY.md)

## Resources

| Resource | Path |
|----------|------|
| Format Guide | [references/midi-format.md](references/midi-format.md) |
| Examples | [examples/](examples/) |
| **Audio-to-MIDI** | [README.md](README.md) - Convert voice/audio to MIDI |
| Setup | [setup.sh](setup.sh) - Install dependencies |

## Audio-to-MIDI Converter

Convert voice, humming, or audio files to MIDI:

```bash
# Setup
./setup.sh

# Convert audio file
python3 audio-to-midi.py input.wav output.midi

# Live microphone capture
python3 audio-to-midi.py --live
```

See [README.md](README.md) for full documentation.


| Resource     | Path                                                   |
| ------------ | ------------------------------------------------------ |
| Format Guide | [references/midi-format.md](references/midi-format.md) |
| Examples     | [examples/](examples/)                                 |

## Quick Example

```midi
Track: Piano
Tempo: 120
Key: C Major

Measure 1:
C4 quarter velocity=80
E4 quarter velocity=80
G4 quarter velocity=80
C5 quarter velocity=80
```

## Playing MIDI

Convert to audio:

```bash
# Using timidity (Linux/Mac)
timidity song.midi -Ow -o song.wav

# Using fluidsynth
fluidsynth -ni /path/to/soundfont.sf2 song.midi -r 44100 -o audio.filetype=au -F song.au
```

Or use online players like [MidiPlayer](https://onlinemidiplayer.com/)

## Note

MIDI is technically **notation** (like math), not visuals. Consider placing audio content in `wrighter/notation/` alongside LaTeX for mathematical notation.
