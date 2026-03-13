#!/usr/bin/env python3
"""
MIDI Player for Omni
Converts text-based MIDI to binary and plays it
"""

import sys
import os
import re
import subprocess
import tempfile

try:
    import mido
    from mido import Message, MidiFile, MidiTrack, MetaMessage
    HAS_MIDO = True
except ImportError:
    HAS_MIDO = False
    print("Warning: mido not installed. Install with: pip install mido")

def parse_text_midi(filepath):
    notes = []
    tempo = 120
    time_sig = (4, 4)
    key = "C Major"
    track_name = "Track"
    
    duration_map = {
        'whole': 1920, 'dotted-half': 1440, 'half': 960,
        'dotted-quarter': 720, 'quarter': 480, 'dotted-eighth': 360,
        'eighth': 240, 'sixteenth': 120, '32nd': 60
    }
    
    note_map = {}
    for octave in range(0, 10):
        base = 12 * (octave + 1)
        for note, offset in [('C', 0), ('C#', 1), ('D', 2), ('D#', 3), 
                           ('E', 4), ('F', 5), ('F#', 6), ('G', 7),
                           ('G#', 8), ('A', 9), ('A#', 10), ('B', 11)]:
            note_map[f'{note}{octave}'] = base + offset
    
    with open(filepath, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            if line.startswith('Track:'):
                track_name = line.split(':', 1)[1].strip()
            elif line.startswith('Tempo:'):
                tempo = int(line.split(':', 1)[1].strip())
            elif line.startswith('Time:'):
                parts = line.split(':', 1)[1].strip().split('/')
                time_sig = (int(parts[0]), int(parts[1]))
            elif line.startswith('Key:'):
                key = line.split(':', 1)[1].strip()
            elif re.match(r'^[A-G]#?\d+\s+\w+', line):
                parts = line.split()
                if len(parts) >= 2:
                    note_str, duration_str = parts[0], parts[1]
                    velocity = 64
                    for part in parts[2:]:
                        if part.startswith('velocity='):
                            velocity = int(part.split('=')[1])
                    
                    if note_str in note_map and duration_str in duration_map:
                        notes.append({
                            'note': note_map[note_str],
                            'duration': duration_map[duration_str],
                            'velocity': velocity
                        })
    
    return {
        'track_name': track_name,
        'tempo': tempo,
        'time_sig': time_sig,
        'key': key,
        'notes': notes
    }

def create_midi(data, output_path):
    if not HAS_MIDO:
        raise RuntimeError("mido library required. Install: pip install mido")
    
    mid = MidiFile()
    track = MidiTrack()
    mid.tracks.append(track)
    
    track.append(MetaMessage('track_name', name=data['track_name'], time=0))
    track.append(MetaMessage('set_tempo', tempo=mido.bpm2tempo(data['tempo']), time=0))
    track.append(MetaMessage('time_signature', 
        numerator=data['time_sig'][0], 
        denominator=data['time_sig'][1],
        clocks_per_click=24,
        notated_32nd_notes_per_beat=8, time=0))
    
    time = 0
    for note_data in data['notes']:
        note, duration, velocity = note_data['note'], note_data['duration'], note_data['velocity']
        track.append(Message('note_on', note=note, velocity=velocity, time=time))
        track.append(Message('note_off', note=note, velocity=0, time=duration))
        time = 0  # After first note, delta is 0 for simultaneous
    
    track.append(MetaMessage('end_of_track', time=0))
    mid.save(output_path)
    return output_path

def play_with_fluidsynth(midi_path):
    soundfont_paths = [
        '/usr/share/sounds/sf2/FluidR3_GM.sf2',
        '/usr/share/sounds/sf2/default-GM.sf2',
    ]
    soundfont = None
    for path in soundfont_paths:
        if os.path.exists(path):
            soundfont = path
            break
    
    if not soundfont:
        print("No soundfont found. Install: sudo apt-get install fluid-soundfont-gm")
        return False
    
    cmd = ['fluidsynth', '-ni', soundfont, midi_path]
    print(f"Playing with fluidsynth using {soundfont}...")
    
    try:
        subprocess.run(cmd, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def play_with_timidity(midi_path):
    try:
        subprocess.run(['timidity', midi_path], check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python play-midi.py <midi-file>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    is_text = False
    with open(input_file, 'r') as f:
        first = f.readline()
        if first.startswith('#') or 'Track:' in first or 'Tempo:' in first:
            is_text = True
    
    if is_text:
        print(f"Converting text-based MIDI: {input_file}")
        data = parse_text_midi(input_file)
        output_file = tempfile.mktemp(suffix='.mid')
        create_midi(data, output_file)
        print(f"Converted to: {output_file}")
        midi_file = output_file
    else:
        midi_file = input_file
    
    print(f"Playing: {midi_file}")
    print("=" * 50)
    
    if play_with_fluidsynth(midi_file):
        return
    if play_with_timidity(midi_file):
        return
    
    print("No MIDI player found. Install: sudo apt-get install fluidsynth")

if __name__ == '__main__':
    main()
