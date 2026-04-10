import { getPlatform } from "../../lib/hermes/platform.js";

export function apply() {
    if (document.getElementById("tts-widget")) return;

    // Inject CSS
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = getPlatform().resolveAsset("affections/text_to_speech/styles.css");
    document.head.appendChild(style);

    createPlayer();
}

function createPlayer() {
    const widget = document.createElement("div");
    widget.id = "tts-widget";
    widget.innerHTML = `
        <div class="tts-header">
            <span>Text to Speech</span>
            <button id="tts-close" title="Close">×</button>
        </div>
        <div class="tts-controls">
            <button id="tts-prev" title="Previous Sentence">⏮</button>
            <button id="tts-play" title="Play">▶</button>
            <button id="tts-pause" title="Pause" style="display:none;">⏸</button>
            <button id="tts-stop" title="Stop">⏹</button>
            <button id="tts-next" title="Next Sentence">⏭</button>
        </div>
        <div class="tts-settings">
            <label for="tts-speed">Speed: <span id="tts-speed-val">1.0</span>x</label>
            <input type="range" id="tts-speed" min="0.5" max="2.0" step="0.1" value="1.0">
        </div>
        <div id="tts-status">Ready</div>
    `;
    document.body.appendChild(widget);

    // Logic
    let utterance = null;
    let isPaused = false;
    let textChunks = [];
    let currentChunkIndex = 0;

    const btnPlay = widget.querySelector("#tts-play");
    const btnPause = widget.querySelector("#tts-pause");
    const btnStop = widget.querySelector("#tts-stop");
    const btnPrev = widget.querySelector("#tts-prev");
    const btnNext = widget.querySelector("#tts-next");
    const btnClose = widget.querySelector("#tts-close");
    const sliderSpeed = widget.querySelector("#tts-speed");
    const labelSpeed = widget.querySelector("#tts-speed-val");
    const status = widget.querySelector("#tts-status");

    // Prevent buttons from clearing selection
    widget.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("mousedown", e => e.preventDefault());
    });

    function getTextToRead() {
        const selection = window.getSelection().toString().trim();
        return selection || document.body.innerText;
    }

    function splitText(text) {
        // Split by sentence endings roughly
        return text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    }

    function speak() {
        if (isPaused) {
            window.speechSynthesis.resume();
            isPaused = false;
            togglePlayBtn(true);
            status.textContent = "Speaking...";
            return;
        }

        window.speechSynthesis.cancel();

        const text = getTextToRead();
        if (!text) {
            status.textContent = "No text found";
            return;
        }
        textChunks = splitText(text);
        
        if (currentChunkIndex >= textChunks.length) currentChunkIndex = 0;
        
        playChunk();
    }

    function playChunk() {
        if (currentChunkIndex >= textChunks.length) {
            status.textContent = "Finished";
            togglePlayBtn(false);
            return;
        }

        const chunk = textChunks[currentChunkIndex];
        utterance = new SpeechSynthesisUtterance(chunk);
        utterance.rate = parseFloat(sliderSpeed.value);
        
        utterance.onend = () => {
            // Only advance if we weren't cancelled
            if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                 // Natural end of utterance
            }
            currentChunkIndex++;
            if (!isPaused && currentChunkIndex < textChunks.length) {
                playChunk();
            } else if (currentChunkIndex >= textChunks.length) {
                status.textContent = "Finished";
                togglePlayBtn(false);
            }
        };

        utterance.onerror = (e) => {
            console.error("TTS Error", e);
            // Don't stop on minor errors, try next
            if (e.error !== 'interrupted') {
                 status.textContent = "Error: " + e.error;
            }
        };

        status.textContent = `Reading ${currentChunkIndex + 1}/${textChunks.length}`;
        window.speechSynthesis.speak(utterance);
        togglePlayBtn(true);
    }

    function togglePlayBtn(isPlaying) {
        if (isPlaying) {
            btnPlay.style.display = "none";
            btnPause.style.display = "inline-block";
        } else {
            btnPlay.style.display = "inline-block";
            btnPause.style.display = "none";
        }
    }

    btnPlay.addEventListener("click", speak);
    
    btnPause.addEventListener("click", () => {
        window.speechSynthesis.pause();
        isPaused = true;
        togglePlayBtn(false);
        status.textContent = "Paused";
    });

    btnStop.addEventListener("click", () => {
        window.speechSynthesis.cancel();
        isPaused = false;
        currentChunkIndex = 0;
        togglePlayBtn(false);
        status.textContent = "Stopped";
    });

    btnNext.addEventListener("click", () => {
        window.speechSynthesis.cancel();
        currentChunkIndex++;
        if (currentChunkIndex >= textChunks.length) currentChunkIndex = 0;
        playChunk();
    });

    btnPrev.addEventListener("click", () => {
        window.speechSynthesis.cancel();
        currentChunkIndex--;
        if (currentChunkIndex < 0) currentChunkIndex = 0;
        playChunk();
    });

    sliderSpeed.addEventListener("input", (e) => {
        labelSpeed.textContent = e.target.value;
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            playChunk();
        }
    });

    btnClose.addEventListener("click", () => {
        window.speechSynthesis.cancel();
        widget.remove();
    });
}