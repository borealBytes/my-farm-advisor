# Audio-to-MIDI Converter

Convert audio files or live microphone input to text-based MIDI format.

## Features

- 🎵 **File Mode**: Convert WAV, MP3, M4A files to MIDI
- 🎤 **Live Mode**: Real-time microphone capture
- 🧠 **ML-Powered**: Uses Spotify's Basic Pitch for pitch detection
- 🎼 **Smart Output**: Auto key detection and quantization
- 📝 **Text-Based**: Output in readable MIDI format

## Installation

```bash
./setup.sh
```

Or manually:

```bash
pip install basic-pitch librosa soundfile mido music21 sounddevice numpy
```

System dependencies:

```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg portaudio19-dev

# macOS
brew install ffmpeg portaudio
```

## Usage

### File Mode

Convert an audio file to MIDI:

```bash
python3 audio-to-midi.py input.wav output.midi
```

Options:

- `--bpm 120`: Set BPM (default: 120)
- `--no-quantize`: Disable auto-quantization

### Live Mode

Capture from microphone in real-time:

```bash
# Start recording (press 'q' to stop)
python3 audio-to-midi.py --live

# Record for 10 seconds
python3 audio-to-midi.py --live --duration 10 --output live.midi
```

## Examples

See [examples/](examples/) for sample MIDI files.

## How It Works

1. **Audio Input**: File or microphone
2. **Stem Separation**: HPSS isolates melodic content
3. **Pitch Detection**: Basic Pitch ML model detects notes
4. **Key Detection**: Analyzes pitch distribution
5. **Quantization**: Snaps to timing grid
6. **Output**: Text-based MIDI format

## Dependencies

- basic-pitch: Spotify's pitch detection model
- librosa: Audio processing
- sounddevice: Microphone capture
- mido: MIDI file handling
- numpy: Numerical operations
