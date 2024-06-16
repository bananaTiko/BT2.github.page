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
        
        // Extract instruments and handle defaults
        const midiFile = new MidiFile(arrayBuffer);
        const instruments = midiFile.getInstruments(); // Custom function to extract instruments
        
        // Save instruments to a text file
        saveInstrumentsToFile(instruments);
        
        // Display piano and notes
        displayPianoAndNotes(midiFile);
        
        // Play MIDI (assuming you have a way to play MIDI in the browser)
        playMidiInBrowser(arrayBuffer);
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
        // Return array of instrument audio data as base64 strings
        return [
            'base64_encoded_audio_data_for_instrument_1',
            'base64_encoded_audio_data_for_instrument_2',
            'base64_encoded_audio_data_for_instrument_3'
        ]; // Example data
    }
    
    getPianoNotes() {
        // Example: Extract piano notes from MIDI file
        // Return array of piano notes as strings
        return [
            'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'
        ]; // Example data
    }
}

// Function to save instruments to a text file
function saveInstrumentsToFile(instruments) {
    const instrumentsText = instruments.join('\n');
    const blob = new Blob([instrumentsText], { type: 'text/plain' });
    saveBlobAsFile(blob, 'file/instruments.txt');
}

// Function to display piano and notes
function displayPianoAndNotes(midiFile) {
    const pianoNotes = midiFile.getPianoNotes();
    const pianoContainer = document.getElementById('pianoContainer');
    
    // Clear previous notes if any
    pianoContainer.innerHTML = '';
    
    // Create piano keys with notes
    pianoNotes.forEach(note => {
        const keyElement = document.createElement('div');
        keyElement.className = 'pianoKey';
        keyElement.textContent = note;
        pianoContainer.appendChild(keyElement);
    });
}

// Example function to play MIDI in the browser
function playMidiInBrowser(arrayBuffer) {
    // Example: You need a MIDI player implementation to play in the browser
    // This would typically use a library or a custom implementation
}

// Helper function to save Blob as a file
function saveBlobAsFile(blob, fileName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}
