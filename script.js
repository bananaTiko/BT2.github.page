// Global variables for audio context and sources
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;
let audioBuffer = null;
let instrumentPaths = []; // Array to store instrument file paths

// Function to convert MIDI note to frequency
function midiNoteToFrequency(noteNumber) {
    return 440 * Math.pow(2, (noteNumber - 69) / 12);
}

// Function to load audio file
function loadAudioFile(filePath) {
    return fetch(filePath)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(decodedBuffer => {
            audioBuffer = decodedBuffer;
        })
        .catch(error => console.error('Error loading audio file:', error));
}

// Function to play loaded audio
function playAudio() {
    if (audioSource && audioBuffer) {
        audioSource = audioContext.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.connect(audioContext.destination);
        audioSource.start();
    }
}

// Function to stop audio playback
function stopAudio() {
    if (audioSource) {
        audioSource.stop();
    }
}

// Function to set pitch based on MIDI note
function setPitch(midiNote) {
    if (audioSource && audioBuffer) {
        const frequency = midiNoteToFrequency(midiNote);
        const detune = Math.log2(frequency / 440) * 1200; // Calculate detune in cents

        audioSource.detune.value = detune;
    }
}

// Function to handle MIDI file playback and instrument extraction
function playMIDI() {
    const fileInput = document.getElementById('midiFileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a MIDI file.');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const arrayBuffer = event.target.result;
        
        // Example: Implement MIDI file parsing logic to extract instruments and file paths
        const midiFile = new MidiFile(arrayBuffer);
        const instruments = midiFile.getInstruments(); // Custom function to extract instruments
        
        // Save instrument paths to array
        instrumentPaths = instruments.map(instrument => `file/Audio/${instrument}.wav`); // Adjust path as needed
        
        // Save instrument paths to text file
        saveInstrumentsToFile(instrumentPaths);
        
        // Example: Extract piano notes from MIDI file
        const pianoNotes = midiFile.getPianoNotes(); // Custom function to extract piano notes
        
        // Display piano keys with notes
        displayPianoAndNotes(pianoNotes);
        
        // Load audio file based on instrument from instruments.txt
        loadInstrumentPaths()
            .then(() => {
                console.log('Instruments loaded successfully.');
                const instrumentFilePath = instrumentPaths[0]; // Example: Load first instrument path
                return loadAudioFile(instrumentFilePath);
            })
            .then(() => {
                console.log('Audio file loaded successfully.');
            })
            .catch(error => {
                console.error('Error loading audio file:', error);
            });
    };
    
    reader.onerror = function(event) {
        console.error('File could not be read! Code ' + event.target.error.code);
    };
    
    reader.readAsArrayBuffer(file);
}

// Function to load instrument paths from instruments.txt
function loadInstrumentPaths() {
    return fetch('file/audio/instruments.txt')
        .then(response => response.text())
        .then(data => {
            // Split data into array of paths
            instrumentPaths = data.trim().split('\n');
        })
        .catch(error => console.error('Error loading instrument paths:', error));
}

// Example MidiFile class for demonstration purposes
class MidiFile {
    constructor(arrayBuffer) {
        // Example: Implement MIDI file parsing logic
        // This is a simplified example for demonstration
    }
    
    getInstruments() {
        // Example: Extract instruments from MIDI file
        // Return array of instrument names
        return ['instrument1', 'instrument2', 'instrument3']; // Example data
    }
    
    getPianoNotes() {
        // Example: Extract piano notes from MIDI file
        // Return array of piano notes as MIDI note numbers
        // Adjust range from C0 to B9 (21 to 118)
        const pianoNotes = [];
        for (let note = 21; note <= 118; note++) {
            pianoNotes.push(note);
        }
        return pianoNotes;
    }
}

// Function to display piano keys with notes
function displayPianoAndNotes(pianoNotes) {
    const pianoContainer = document.getElementById('pianoContainer');
    const pianoAppContainer = document.getElementById('pianoAppContainer');
    const speedControl = document.getElementById('speedControl');
    
    // Clear previous piano keys if any
    pianoContainer.innerHTML = '';
    
    // Clear previous piano app interface if any
    pianoAppContainer.innerHTML = '';
    
    // Create piano keys with notes
    pianoNotes.forEach(note => {
        const keyElement = document.createElement('div');
        keyElement.className = 'pianoKey';
        keyElement.textContent = getNoteName(note); // Display note name
        keyElement.addEventListener('mousedown', () => {
            setPitch(note);
            playAudio(); // Start playback when key is pressed
        });
        keyElement.addEventListener('mouseup', stopAudio); // Stop playback on key release
        pianoContainer.appendChild(keyElement);
    });
    
    // Create digital piano app interface
    const appInterface = document.createElement('div');
    appInterface.className = 'pianoAppInterface';
    
    // Create speed control for music
    const speedLabel = document.createElement('label');
    speedLabel.textContent = 'Speed:';
    
    const speedInput = document.createElement('input');
    speedInput.type = 'range';
    speedInput.min = '0.5';
    speedInput.max = '2.0';
    speedInput.step = '0.1';
    speedInput.value = '1.0';
    speedInput.id = 'speedControlInput';
    
    const speedDisplay = document.createElement('span');
    speedDisplay.id = 'speedDisplay';
    speedDisplay.textContent = speedInput.value;
    
    speedInput.addEventListener('input', () => {
        speedDisplay.textContent = speedInput.value;
        // Adjust playback speed based on input value
        if (audioSource) {
            audioSource.playbackRate.value = parseFloat(speedInput.value);
        }
    });
    
    speedControl.appendChild(speedLabel);
    speedControl.appendChild(speedInput);
    speedControl.appendChild(speedDisplay);
    
    // Example: Create piano keys with notes lit up (based on MIDI data)
    pianoNotes.forEach(note => {
        const keyElement = document.createElement('div');
        keyElement.className = 'pianoKeyApp';
        keyElement.textContent = getNoteName(note); // Display note name
        
        // Add class to indicate note to play (example: green notes)
        if (noteShouldBePlayed(note)) {
            keyElement.classList.add('noteToPlay');
        }
        
        appInterface.appendChild(keyElement);
    });
    
    pianoAppContainer.appendChild(appInterface);
}

// Example function to determine if note should be played (replace with actual logic)
function noteShouldBePlayed(midiNote) {
    // Example: Determine if MIDI note should be played based on MIDI data or user input
    return true; // Replace with actual logic
}

// Function to get note name from MIDI note number
function getNoteName(midiNote) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12);
    const noteIndex = midiNote % 12;
    return noteNames[noteIndex] + octave;
}

// Function to save instrument paths to text file
function saveInstrumentsToFile(instrumentPaths) {
    const instrumentsText = instrumentPaths.join('\n');
    const blob = new Blob([instrumentsText], { type: 'text/plain' });
    saveBlobAsFile(blob, 'file/instruments.txt');
}

// Helper function to save Blob as a file
function saveBlobAsFile(blob, fileName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}
