#!/bin/bash
# Setup script for audio-to-midi dependencies
set -e

echo "Setting up Audio-to-MIDI dependencies..."
echo "========================================"

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $PYTHON_VERSION"

# Check if Python 3.8+
REQUIRED_VERSION="3.8"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "Error: Python 3.8+ required"
    exit 1
fi

echo ""
echo "Installing Python packages..."
pip install -q basic-pitch librosa soundfile mido music21 sounddevice numpy

echo ""
echo "Checking system dependencies..."

# Check for ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️ ffmpeg not found. Install with:"
    echo "  Ubuntu/Debian: sudo apt-get install ffmpeg"
    echo "  macOS: brew install ffmpeg"
fi

# Check for portaudio (required for sounddevice)
if ! ldconfig -p | grep -q portaudio; then
    echo "⚠️ portaudio not found. Install with:"
    echo "  Ubuntu/Debian: sudo apt-get install portaudio19-dev"
    echo "  macOS: brew install portaudio"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Usage:"
echo "  python3 audio-to-midi.py --help"
echo "  python3 audio-to-midi.py input.wav output.midi"
echo "  python3 audio-to-midi.py --live"
