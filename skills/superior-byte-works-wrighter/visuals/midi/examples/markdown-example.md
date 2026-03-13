# Embedding MIDI in Markdown

MIDI notation can be embedded directly in markdown files for version-controlled music documentation.

## Basic Melody

```midi
Track: Simple Melody
Tempo: 120
Key: G Major

Measure 1:
G4 quarter velocity=80
A4 quarter velocity=80
B4 quarter velocity=80
C5 quarter velocity=80

Measure 2:
B4 quarter velocity=80
A4 quarter velocity=80
G4 half velocity=80
```

## Rendering Options

### 1. As Code Block

Display as formatted text (shown above)

### 2. Convert to Sheet Music

Use MuseScore to render to PDF:

```bash
musescore song.midi -o song.pdf
```

### 3. Convert to Audio

```bash
timidity song.midi -Ow -o song.wav
```

### 4. Embed Player

Link to online MIDI player:
[Play this MIDI](https://onlinemidiplayer.com/?url=./simpsons-theme.midi)

## Benefits

- **Text-based**: Diffs in git
- **Editable**: Change any note
- **Small**: 1KB vs 3MB for audio
- **Scalable**: Change tempo/key
