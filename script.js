const voiceSelect = document.getElementById('voice-select');
const textToSpeak = document.getElementById('text-to-speak');
const speakButton = document.getElementById('speak-button');
const messageDiv = document.getElementById('message');

// Ensure the browser supports the Web Speech API
if ('speechSynthesis' in window) {
    let voices = [];
    const synth = window.speechSynthesis;

    function populateVoiceList() {
        voices = synth.getVoices();
        voiceSelect.innerHTML = ''; // Clear existing options

        const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));

        if (englishVoices.length === 0) {
            messageDiv.textContent = 'No English voices found. Your browser might not support this.';
            speakButton.disabled = true;
            return;
        }
        
        // Add each English voice to the dropdown
        englishVoices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = voice.name;
            option.setAttribute('data-lang', voice.lang);
            option.setAttribute('data-name', voice.name);
            voiceSelect.appendChild(option);
        });
        messageDiv.textContent = 'Voices loaded successfully!';
    }

    // Load voices when they are ready
    synth.onvoiceschanged = populateVoiceList;

    // Call it initially in case voices are already loaded
    if (synth.getVoices().length > 0) {
        populateVoiceList();
    }

    // Speak or stop the text when the button is clicked
    speakButton.addEventListener('click', () => {
        // If speech is already in progress, stop it and change the button back to "Speak"
        if (synth.speaking) {
            synth.cancel();
            speakButton.textContent = 'Speak';
            messageDiv.textContent = 'Speech stopped.';
            return; // Exit the function to prevent starting a new speech
        }

        if (textToSpeak.value.trim() === '') {
            messageDiv.textContent = 'Please enter some text to speak.';
            return;
        }

        const selectedVoiceName = voiceSelect.value;
        const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);

        if (!selectedVoice) {
            messageDiv.textContent = 'Selected voice not found.';
            return;
        }

        const utterance = new SpeechSynthesisUtterance(textToSpeak.value);
        utterance.voice = selectedVoice;
        utterance.rate = 1; 
        utterance.pitch = 1; 

        // Start speaking
        synth.speak(utterance);

        // Update button text and message while speaking
        speakButton.textContent = 'Stop';
        messageDiv.textContent = 'Speaking...';
        
        utterance.onend = () => {
            messageDiv.textContent = 'Done speaking.';
            speakButton.textContent = 'Speak';
        };
        utterance.onerror = (event) => {
            messageDiv.textContent = 'An error occurred: ' + event.error;
            speakButton.textContent = 'Speak';
        };
    });

} else {
    // If the browser doesn't support the API
    messageDiv.textContent = 'Web Speech API is not supported in this browser.';
    speakButton.disabled = true;
}
