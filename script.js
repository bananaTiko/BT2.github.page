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
        
        // Load audio file (adjust path as needed)
        const audioFilePath = 'file/Audio/instrument_x.wav'; // Adjust this path
        loadAudioFile(audioFilePath)
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
        return [
            60, 62, 64, 65, 67, 69, 71, 72 // Example MIDI note numbers (C4 to C5)
        ];
    }
}

// Function to display piano keys with notes
function displayPianoAndNotes(pianoNotes) {
    const pianoContainer = document.getElementById('pianoContainer');
    
    // Clear previous notes if any
    pianoContainer.innerHTML = '';
    
    // Create piano keys with notes
    pianoNotes.forEach(note => {
        const keyElement = document.createElement('div');
        keyElement.className = 'pianoKey';
        keyElement.textContent = note; // Display MIDI note number for simplicity
        keyElement.addEventListener('mousedown', () => {
            setPitch(note);
            playAudio(); // Start playback when key is pressed
        });
        keyElement.addEventListener('mouseup', stopAudio); // Stop playback on key release
        pianoContainer.appendChild(keyElement);
    });
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
