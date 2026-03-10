#!/usr/bin/env python3
"""
Audio-to-MIDI Converter

Converts audio files (WAV, MP3, M4A) or live microphone input to text-based MIDI format.
Uses Spotify's Basic Pitch for ML-based pitch detection.

Usage:
    # File mode
    python3 audio-to-midi.py input.wav output.midi

    # Live microphone mode
    python3 audio-to-midi.py --live

    # Live with duration
    python3 audio-to-midi.py --live --duration 10 --output live.midi
"""

import argparse
import sys
import os
import time
import threading
import queue
from pathlib import Path
from typing import List, Tuple, Optional, Dict
from dataclasses import dataclass
from collections import Counter

import numpy as np

# Optional imports with helpful error messages
try:
    from basic_pitch import ICASSP_2022_MODEL_PATH
    from basic_pitch.inference import predict
    from basic_pitch import note_events_to_midi

    BASIC_PITCH_AVAILABLE = True
except ImportError:
    BASIC_PITCH_AVAILABLE = False

try:
    import sounddevice as sd

    SOUNDDEVICE_AVAILABLE = True
except ImportError:
    SOUNDDEVICE_AVAILABLE = False

try:
    import librosa

    LIBROSA_AVAILABLE = True
except ImportError:
    LIBROSA_AVAILABLE = False

try:
    import soundfile as sf

    SOUNDFILE_AVAILABLE = True
except ImportError:
    SOUNDFILE_AVAILABLE = False

try:
    import mido

    MIDO_AVAILABLE = True
except ImportError:
    MIDO_AVAILABLE = False


@dataclass
class NoteEvent:
    """Represents a single note event."""

    pitch: int  # MIDI note number (0-127)
    start_time: float  # Start time in seconds
    end_time: float  # End time in seconds
    velocity: int  # Velocity (0-127)

    @property
    def duration(self) -> float:
        return self.end_time - self.start_time

    @property
    def note_name(self) -> str:
        """Convert MIDI note number to note name (e.g., 60 -> C4)."""
        note_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        octave = (self.pitch // 12) - 1
        note_idx = self.pitch % 12
        return f"{note_names[note_idx]}{octave}"


class KeyDetector:
    """Detects musical key from a collection of notes."""

    # Circle of fifths and key signatures
    KEY_SIGNATURES = {
        "C Major": [0, 2, 4, 5, 7, 9, 11],  # No sharps/flats
        "G Major": [0, 2, 4, 6, 7, 9, 11],  # 1 sharp
        "D Major": [0, 2, 4, 6, 7, 9, 11],  # 2 sharps (F#, C#)
        "A Major": [0, 2, 4, 6, 8, 9, 11],  # 3 sharps
        "E Major": [0, 2, 4, 6, 8, 9, 11],  # 4 sharps
        "B Major": [0, 2, 4, 6, 8, 10, 11],  # 5 sharps
        "F# Major": [0, 1, 3, 5, 6, 8, 10],  # 6 sharps
        "F Major": [0, 2, 4, 5, 7, 9, 10],  # 1 flat
        "Bb Major": [0, 2, 3, 5, 7, 9, 10],  # 2 flats
        "Eb Major": [0, 2, 3, 5, 7, 8, 10],  # 3 flats
        "Ab Major": [0, 1, 3, 5, 7, 8, 10],  # 4 flats
        "Db Major": [0, 1, 3, 5, 6, 8, 10],  # 5 flats
        "Gb Major": [0, 1, 3, 4, 6, 8, 10],  # 6 flats
    }

    # Minor keys (relative minor = major - 3 semitones)
    MINOR_KEYS = {
        "A Minor": "C Major",
        "E Minor": "G Major",
        "B Minor": "D Major",
        "F# Minor": "A Major",
        "C# Minor": "E Major",
        "G# Minor": "B Major",
        "D# Minor": "F# Major",
        "D Minor": "F Major",
        "G Minor": "Bb Major",
        "C Minor": "Eb Major",
        "F Minor": "Ab Major",
        "Bb Minor": "Db Major",
        "Eb Minor": "Gb Major",
    }

    @classmethod
    def detect_key(cls, notes: List[NoteEvent]) -> str:
        """Detect the most likely key from note events."""
        if not notes:
            return "C Major"

        # Count pitch classes
        pitch_classes = Counter()
        for note in notes:
            pitch_classes[note.pitch % 12] += 1

        # Score each key
        key_scores = {}
        for key_name, key_pitches in cls.KEY_SIGNATURES.items():
            score = sum(pitch_classes[p] for p in key_pitches)
            key_scores[key_name] = score

        # Also score minor keys
        for minor_key, major_key in cls.MINOR_KEYS.items():
            key_scores[minor_key] = key_scores.get(major_key, 0) * 0.9

        # Return highest scoring key
        if key_scores:
            return max(key_scores, key=key_scores.get)
        return "C Major"


class Quantizer:
    """Quantizes note timings to musical grid."""

    # Standard durations in seconds at 120 BPM
    DURATIONS = {
        "whole": 2.0,
        "dotted_half": 1.5,
        "half": 1.0,
        "dotted_quarter": 0.75,
        "quarter": 0.5,
        "dotted_eighth": 0.375,
        "eighth": 0.25,
        "sixteenth": 0.125,
        "32nd": 0.0625,
    }

    def __init__(self, bpm: int = 120, time_signature: Tuple[int, int] = (4, 4)):
        self.bpm = bpm
        self.time_signature = time_signature
        self.beat_duration = 60.0 / bpm
        self.measure_duration = self.beat_duration * time_signature[0]

    def quantize_time(self, time: float) -> float:
        """Quantize time to nearest 16th note."""
        sixteenth_duration = self.beat_duration / 4
        quantized = round(time / sixteenth_duration) * sixteenth_duration
        return max(0, quantized)

    def get_duration_name(self, duration: float) -> str:
        """Get the closest duration name for a given duration in seconds."""
        # Adjust for tempo
        adjusted_duration = duration * (120 / self.bpm)

        closest_name = "quarter"
        closest_diff = float("inf")

        for name, base_duration in self.DURATIONS.items():
            diff = abs(adjusted_duration - base_duration)
            if diff < closest_diff:
                closest_diff = diff
                closest_name = name

        return closest_name

    def quantize_notes(self, notes: List[NoteEvent]) -> List[NoteEvent]:
        """Quantize all note timings."""
        quantized = []
        for note in notes:
            q_start = self.quantize_time(note.start_time)
            q_end = self.quantize_time(note.end_time)
            # Ensure minimum duration
            if q_end <= q_start:
                q_end = q_start + self.beat_duration / 4

            quantized.append(
                NoteEvent(
                    pitch=note.pitch,
                    start_time=q_start,
                    end_time=q_end,
                    velocity=note.velocity,
                )
            )
        return quantized


class AudioToMIDIConverter:
    """Main converter class for audio to MIDI conversion."""

    def __init__(self, bpm: int = 120, auto_quantize: bool = True):
        self.bpm = bpm
        self.auto_quantize = auto_quantize
        self.sample_rate = 22050  # Basic Pitch default

    def load_audio_file(self, file_path: str) -> np.ndarray:
        """Load audio file using librosa or soundfile."""
        if not LIBROSA_AVAILABLE and not SOUNDFILE_AVAILABLE:
            raise ImportError(
                "Either librosa or soundfile is required for audio loading"
            )

        print(f"Loading audio file: {file_path}")

        if LIBROSA_AVAILABLE:
            audio, sr = librosa.load(file_path, sr=self.sample_rate, mono=True)
        else:
            audio, sr = sf.read(file_path)
            if audio.ndim > 1:
                audio = audio.mean(axis=1)  # Convert to mono
            if sr != self.sample_rate:
                # Simple resampling
                import scipy.signal

                audio = scipy.signal.resample(
                    audio, int(len(audio) * self.sample_rate / sr)
                )

        return audio

    def detect_pitch_basic_pitch(self, audio: np.ndarray) -> List[NoteEvent]:
        """Detect pitch using Spotify's Basic Pitch."""
        if not BASIC_PITCH_AVAILABLE:
            raise ImportError(
                "basic_pitch is required for pitch detection. Install with: pip install basic-pitch"
            )

        print("Running Basic Pitch detection...")

        # Run inference
        model_output, midi_data, note_events = predict(audio)

        # Convert to NoteEvent objects
        notes = []
        for start_time, end_time, pitch, confidence in note_events:
            # Convert confidence to velocity (0-127)
            velocity = int(min(127, max(1, confidence * 127)))
            notes.append(
                NoteEvent(
                    pitch=int(pitch),
                    start_time=float(start_time),
                    end_time=float(end_time),
                    velocity=velocity,
                )
            )

        return notes

    def detect_pitch_fallback(self, audio: np.ndarray) -> List[NoteEvent]:
        """Fallback pitch detection using librosa (less accurate)."""
        if not LIBROSA_AVAILABLE:
            raise ImportError("librosa is required for fallback pitch detection")

        print("Using fallback pitch detection (librosa)...")

        # Use piptrack for pitch detection
        hop_length = 512
        pitches, magnitudes = librosa.piptrack(
            y=audio, sr=self.sample_rate, hop_length=hop_length
        )

        notes = []
        times = librosa.frames_to_time(
            np.arange(pitches.shape[1]), sr=self.sample_rate, hop_length=hop_length
        )

        # Simple note tracking
        active_notes = {}
        threshold = 0.5

        for t_idx in range(pitches.shape[1]):
            time = times[t_idx]

            # Find the strongest pitch
            mag_slice = magnitudes[:, t_idx]
            if mag_slice.max() > threshold:
                pitch_idx = mag_slice.argmax()
                freq = pitches[pitch_idx, t_idx]

                if freq > 0:
                    # Convert frequency to MIDI note
                    midi_note = int(round(69 + 12 * np.log2(freq / 440.0)))

                    if 0 <= midi_note <= 127:
                        if midi_note not in active_notes:
                            active_notes[midi_note] = {
                                "start": time,
                                "velocity": int(min(127, mag_slice.max() * 127)),
                            }
            else:
                # End all active notes
                for pitch, data in active_notes.items():
                    notes.append(
                        NoteEvent(
                            pitch=pitch,
                            start_time=data["start"],
                            end_time=time,
                            velocity=data["velocity"],
                        )
                    )
                active_notes = {}

        # End any remaining notes
        end_time = times[-1] if len(times) > 0 else 0
        for pitch, data in active_notes.items():
            notes.append(
                NoteEvent(
                    pitch=pitch,
                    start_time=data["start"],
                    end_time=end_time,
                    velocity=data["velocity"],
                )
            )

        return notes

    def convert_file(self, input_path: str, output_path: str) -> None:
        """Convert an audio file to MIDI."""
        # Load audio
        audio = self.load_audio_file(input_path)

        # Detect pitch
        if BASIC_PITCH_AVAILABLE:
            notes = self.detect_pitch_basic_pitch(audio)
        else:
            notes = self.detect_pitch_fallback(audio)

        print(f"Detected {len(notes)} notes")

        # Quantize if enabled
        if self.auto_quantize:
            quantizer = Quantizer(bpm=self.bpm)
            notes = quantizer.quantize_notes(notes)
            print("Notes quantized to grid")

        # Detect key
        key = KeyDetector.detect_key(notes)
        print(f"Detected key: {key}")

        # Generate output
        self.write_text_midi(notes, output_path, key=key)
        print(f"MIDI written to: {output_path}")

    def record_live(
        self, duration: Optional[float] = None, output_path: Optional[str] = None
    ) -> None:
        """Record from microphone and convert to MIDI."""
        if not SOUNDDEVICE_AVAILABLE:
            raise ImportError(
                "sounddevice is required for live recording. Install with: pip install sounddevice"
            )

        print("=" * 60)
        print("LIVE AUDIO-TO-MIDI CONVERTER")
        print("=" * 60)
        print("\nPress 'q' to stop recording")
        print("Recording will start in 3 seconds...")
        time.sleep(3)

        # Audio buffer
        audio_buffer = []
        recording = True
        stop_event = threading.Event()

        def audio_callback(indata, frames, time_info, status):
            """Callback for audio stream."""
            if status:
                print(f"Audio status: {status}")
            audio_buffer.append(indata.copy())

        def check_keyboard():
            """Check for 'q' key press."""
            nonlocal recording
            print("\nRecording... (press 'q' to stop)")

            # Try to use keyboard module if available
            try:
                import keyboard

                while recording:
                    if keyboard.is_pressed("q"):
                        recording = False
                        stop_event.set()
                        break
                    time.sleep(0.1)
            except ImportError:
                # Fallback to input
                input()
                recording = False
                stop_event.set()

        # Start recording
        stream = sd.InputStream(
            samplerate=self.sample_rate,
            channels=1,
            callback=audio_callback,
            blocksize=1024,
        )

        all_notes = []
        chunk_duration = 2.0  # Process in 2-second chunks

        with stream:
            if duration:
                print(f"Recording for {duration} seconds...")
                start_time = time.time()
                while time.time() - start_time < duration:
                    sd.sleep(int(chunk_duration * 1000))

                    # Process accumulated audio
                    if audio_buffer:
                        audio_chunk = np.concatenate(audio_buffer, axis=0).flatten()
                        audio_buffer = []

                        # Detect notes in chunk
                        if BASIC_PITCH_AVAILABLE:
                            notes = self.detect_pitch_basic_pitch(audio_chunk)
                        else:
                            notes = self.detect_pitch_fallback(audio_chunk)

                        # Adjust timestamps
                        offset = time.time() - start_time - chunk_duration
                        for note in notes:
                            note.start_time += offset
                            note.end_time += offset

                        all_notes.extend(notes)

                        # Display detected notes
                        if notes:
                            print(
                                f"\rDetected: {len(notes)} notes | Latest: {notes[-1].note_name if notes else 'None'}    ",
                                end="",
                            )

                print("\nRecording complete!")
            else:
                # Start keyboard listener
                keyboard_thread = threading.Thread(target=check_keyboard)
                keyboard_thread.daemon = True
                keyboard_thread.start()

                chunk_start = time.time()
                while recording:
                    sd.sleep(100)  # 100ms sleep

                    # Process every chunk_duration seconds
                    if time.time() - chunk_start >= chunk_duration:
                        if audio_buffer:
                            audio_chunk = np.concatenate(audio_buffer, axis=0).flatten()
                            audio_buffer = []

                            # Detect notes
                            if BASIC_PITCH_AVAILABLE:
                                notes = self.detect_pitch_basic_pitch(audio_chunk)
                            else:
                                notes = self.detect_pitch_fallback(audio_chunk)

                            all_notes.extend(notes)

                            # Display
                            if notes:
                                note_names = [n.note_name for n in notes[-5:]]
                                print(
                                    f"\rDetected: {len(all_notes)} total | Recent: {' '.join(note_names)}    ",
                                    end="",
                                )

                        chunk_start = time.time()

                print("\n\nRecording stopped!")

        # Process any remaining audio
        if audio_buffer:
            audio_chunk = np.concatenate(audio_buffer, axis=0).flatten()
            if BASIC_PITCH_AVAILABLE:
                notes = self.detect_pitch_basic_pitch(audio_chunk)
            else:
                notes = self.detect_pitch_fallback(audio_chunk)
            all_notes.extend(notes)

        print(f"\nTotal notes detected: {len(all_notes)}")

        if all_notes:
            # Quantize
            if self.auto_quantize:
                quantizer = Quantizer(bpm=self.bpm)
                all_notes = quantizer.quantize_notes(all_notes)

            # Detect key
            key = KeyDetector.detect_key(all_notes)
            print(f"Detected key: {key}")

            # Write output
            if output_path is None:
                timestamp = time.strftime("%Y%m%d_%H%M%S")
                output_path = f"live_recording_{timestamp}.midi"

            self.write_text_midi(all_notes, output_path, key=key)
            print(f"MIDI written to: {output_path}")
        else:
            print("No notes detected!")

    def write_text_midi(
        self, notes: List[NoteEvent], output_path: str, key: str = "C Major"
    ) -> None:
        """Write notes to text-based MIDI format."""
        quantizer = Quantizer(bpm=self.bpm)

        # Group notes by measure
        measures: Dict[int, List[NoteEvent]] = {}
        for note in notes:
            measure_num = int(note.start_time / quantizer.measure_duration) + 1
            if measure_num not in measures:
                measures[measure_num] = []
            measures[measure_num].append(note)

        # Generate output
        lines = [
            "# Audio-to-MIDI Conversion",
            f"# Source: {'Live Recording' if 'live' in output_path.lower() else 'Audio File'}",
            f"# Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}",
            "",
            f"Track: Voice to MIDI",
            f"Tempo: {self.bpm}",
            f"Time: 4/4",
            f"Key: {key}",
            "",
        ]

        # Sort measures and generate note lines
        for measure_num in sorted(measures.keys()):
            lines.append(f"Measure {measure_num}:")

            measure_notes = sorted(measures[measure_num], key=lambda n: n.start_time)

            for note in measure_notes:
                duration_name = quantizer.get_duration_name(note.duration)
                lines.append(
                    f"{note.note_name} {duration_name} velocity={note.velocity}"
                )

            lines.append("")

        lines.append("End")

        # Write to file
        with open(output_path, "w") as f:
            f.write("\n".join(lines))


def check_dependencies() -> List[str]:
    """Check which dependencies are available."""
    missing = []

    if not BASIC_PITCH_AVAILABLE:
        missing.append("basic-pitch (pip install basic-pitch)")
    if not SOUNDDEVICE_AVAILABLE:
        missing.append("sounddevice (pip install sounddevice)")
    if not LIBROSA_AVAILABLE:
        missing.append("librosa (pip install librosa)")
    if not SOUNDFILE_AVAILABLE:
        missing.append("soundfile (pip install soundfile)")
    if not MIDO_AVAILABLE:
        missing.append("mido (pip install mido)")

    return missing


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Convert audio files or live microphone input to text-based MIDI format.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Convert audio file to MIDI
  python3 audio-to-midi.py input.wav output.midi
  
  # Live microphone mode
  python3 audio-to-midi.py --live
  
  # Live with 10 second duration
  python3 audio-to-midi.py --live --duration 10 --output live.midi
  
  # Disable auto-quantization
  python3 audio-to-midi.py input.wav output.midi --no-quantize
        """,
    )

    parser.add_argument(
        "input_file", nargs="?", help="Input audio file (WAV, MP3, M4A)"
    )
    parser.add_argument("output_file", nargs="?", help="Output MIDI file path")
    parser.add_argument(
        "--live", action="store_true", help="Use live microphone input instead of file"
    )
    parser.add_argument(
        "--duration",
        type=float,
        metavar="SECONDS",
        help="Recording duration in seconds (for live mode)",
    )
    parser.add_argument(
        "--output", "-o", metavar="PATH", help="Output file path (for live mode)"
    )
    parser.add_argument(
        "--bpm",
        type=int,
        default=120,
        metavar="BPM",
        help="Beats per minute for quantization (default: 120)",
    )
    parser.add_argument(
        "--no-quantize", action="store_true", help="Disable auto-quantization"
    )
    parser.add_argument(
        "--check", action="store_true", help="Check dependencies and exit"
    )

    args = parser.parse_args()

    # Check dependencies
    if args.check:
        missing = check_dependencies()
        if missing:
            print("Missing dependencies:")
            for dep in missing:
                print(f"  - {dep}")
            sys.exit(1)
        else:
            print("All dependencies are installed!")
            print(f"  - basic_pitch: {BASIC_PITCH_AVAILABLE}")
            print(f"  - sounddevice: {SOUNDDEVICE_AVAILABLE}")
            print(f"  - librosa: {LIBROSA_AVAILABLE}")
            print(f"  - soundfile: {SOUNDFILE_AVAILABLE}")
            print(f"  - mido: {MIDO_AVAILABLE}")
            sys.exit(0)

    # Validate arguments
    if args.live:
        # Live mode
        if args.duration and args.duration <= 0:
            parser.error("Duration must be positive")

        missing = check_dependencies()
        if not SOUNDDEVICE_AVAILABLE:
            print("Error: sounddevice is required for live mode")
            print("Install with: pip install sounddevice")
            sys.exit(1)

        converter = AudioToMIDIConverter(
            bpm=args.bpm, auto_quantize=not args.no_quantize
        )

        try:
            converter.record_live(duration=args.duration, output_path=args.output)
        except KeyboardInterrupt:
            print("\n\nRecording interrupted by user")
            sys.exit(0)
        except Exception as e:
            print(f"\nError during recording: {e}")
            sys.exit(1)

    else:
        # File mode
        if not args.input_file:
            parser.error("Input file is required (or use --live for microphone mode)")

        if not args.output_file:
            # Generate output filename
            base = Path(args.input_file).stem
            args.output_file = f"{base}.midi"

        # Check input file exists
        if not os.path.exists(args.input_file):
            print(f"Error: Input file not found: {args.input_file}")
            sys.exit(1)

        # Check dependencies
        missing = check_dependencies()
        if not LIBROSA_AVAILABLE and not SOUNDFILE_AVAILABLE:
            print("Error: Either librosa or soundfile is required for file mode")
            print("Install with: pip install librosa soundfile")
            sys.exit(1)

        converter = AudioToMIDIConverter(
            bpm=args.bpm, auto_quantize=not args.no_quantize
        )

        try:
            converter.convert_file(args.input_file, args.output_file)
        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)


if __name__ == "__main__":
    main()
