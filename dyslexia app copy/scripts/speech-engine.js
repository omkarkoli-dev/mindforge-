/**
 * MINDFORGE - Speech Engine (Web Speech API Native Wrapper)
 * Supports Bimodal Karaoke Read-Aloud with real-time word boundary highlighting,
 * dynamic playback speeds (0.75x, 1x, 1.25x), single-word phonetics pronunciation,
 * and 2-voice conversational podcast playback.
 */

(function (window) {
  'use strict';

  // Check speech synthesis support
  const isSpeechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const isRecognitionSupported = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);

  const synth = isSpeechSupported ? window.speechSynthesis : null;

  // Internal state
  const state = {
    isPlaying: false,
    isPaused: false,
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    currentWordIndex: -1,
    activeUtterance: null,
    text: '',
    wordsList: [],
    wordOffsets: [],
    activeSpeaker: null,
    voices: [],
    selectedVoice: null,
    keepAliveTimer: null,
    fallbackTimer: null
  };

  // Event callbacks registry
  const listeners = {
    start: [],
    pause: [],
    resume: [],
    stop: [],
    boundary: [],
    end: [],
    error: []
  };

  function emit(eventName, data) {
    if (listeners[eventName]) {
      listeners[eventName].forEach(fn => {
        try {
          fn(data);
        } catch (e) {
          console.error(`[SpeechEngine] Error in ${eventName} listener:`, e);
        }
      });
    }
  }

  /**
   * Load available voices and pick preferred natural English voice
   */
  function loadVoices() {
    if (!synth) return [];
    const available = synth.getVoices() || [];
    state.voices = available;

    if (available.length > 0 && !state.selectedVoice) {
      // Prioritize natural Indian English, then clear natural English
      const preferred = available.find(v =>
        (v.lang === 'en-IN' || v.lang.startsWith('en_IN')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neerja'))
      ) || available.find(v =>
        v.lang === 'en-IN' || v.lang.startsWith('en_IN')
      ) || available.find(v =>
        (v.lang.startsWith('en')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny'))
      ) || available.find(v =>
        v.lang.startsWith('en')
      ) || available[0];

      state.selectedVoice = preferred || null;
    }

    return state.voices;
  }

  // Voice list is loaded asynchronously by browsers
  if (synth) {
    loadVoices();
    if (typeof synth.onvoiceschanged !== 'undefined') {
      synth.onvoiceschanged = () => loadVoices();
    }
  }

  /**
   * Keep Chrome's SpeechSynthesis engine alive on long texts
   * (Chrome bug: pauses after ~14 seconds without error)
   */
  function startKeepAlive() {
    stopKeepAlive();
    state.keepAliveTimer = setInterval(() => {
      if (synth && state.isPlaying && !state.isPaused) {
        synth.pause();
        synth.resume();
      }
    }, 10000);
  }

  function stopKeepAlive() {
    if (state.keepAliveTimer) {
      clearInterval(state.keepAliveTimer);
      state.keepAliveTimer = null;
    }
  }

  function stopFallbackTimer() {
    if (state.fallbackTimer) {
      clearInterval(state.fallbackTimer);
      state.fallbackTimer = null;
    }
  }

  /**
   * Compute character offsets for every word in text
   */
  function computeWordOffsets(text, wordsList) {
    const offsets = [];
    let searchStart = 0;

    for (let i = 0; i < wordsList.length; i++) {
      const w = wordsList[i];
      const foundPos = text.indexOf(w, searchStart);
      if (foundPos !== -1) {
        offsets.push({
          index: i,
          word: w,
          start: foundPos,
          end: foundPos + w.length
        });
        searchStart = foundPos + w.length;
      } else {
        offsets.push({
          index: i,
          word: w,
          start: searchStart,
          end: searchStart + w.length
        });
      }
    }
    return offsets;
  }

  /**
   * SpeechEngine Public Interface
   */
  const SpeechEngine = {
    isSupported: isSpeechSupported,
    isRecognitionSupported: isRecognitionSupported,

    /**
     * Subscribe to speech events:
     * 'start', 'pause', 'resume', 'stop', 'boundary', 'end', 'error'
     */
    on(event, callback) {
      if (listeners[event] && typeof callback === 'function') {
        listeners[event].push(callback);
      }
      return this;
    },

    off(event, callback) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(fn => fn !== callback);
      }
      return this;
    },

    getState() {
      return {
        isPlaying: state.isPlaying,
        isPaused: state.isPaused,
        rate: state.rate,
        currentWordIndex: state.currentWordIndex,
        totalWords: state.wordsList.length
      };
    },

    setRate(newRate) {
      const parsedRate = parseFloat(newRate);
      if (isNaN(parsedRate) || parsedRate <= 0) return;
      state.rate = Math.max(0.5, Math.min(2.0, parsedRate));

      // If actively playing, seamlessly restart from current word
      if (state.isPlaying && !state.isPaused) {
        const resumeIndex = Math.max(0, state.currentWordIndex);
        this.speakFromWordIndex(resumeIndex);
      }
    },

    getRate() {
      return state.rate;
    },

    getVoices() {
      return state.voices.length ? state.voices : loadVoices();
    },

    setVoice(voiceOrName) {
      if (!voiceOrName) return;
      if (typeof voiceOrName === 'string') {
        const found = state.voices.find(v => v.name === voiceOrName);
        if (found) state.selectedVoice = found;
      } else if (typeof voiceOrName === 'object') {
        state.selectedVoice = voiceOrName;
      }
    },

    /**
     * Play full text with real-time word boundary karaoke events
     * @param {string|Array<string>} textOrWords 
     * @param {Object} options { startIndex, rate, pitch, onBoundary }
     */
    speakText(textOrWords, options = {}) {
      if (!synth) {
        console.warn('[SpeechEngine] SpeechSynthesis not supported in this browser.');
        return false;
      }

      this.stop();

      let rawText = '';
      let words = [];

      if (Array.isArray(textOrWords)) {
        words = textOrWords;
        rawText = words.join(' ');
      } else if (typeof textOrWords === 'string') {
        rawText = textOrWords.trim();
        // Extract words for tracking
        words = rawText.match(/\S+/g) || [];
      }

      if (!rawText || words.length === 0) return false;

      state.text = rawText;
      state.wordsList = words;
      state.wordOffsets = computeWordOffsets(rawText, words);

      const startIndex = typeof options.startIndex === 'number' ? options.startIndex : 0;
      state.currentWordIndex = startIndex;

      return this.speakFromWordIndex(startIndex, options);
    },

    /**
     * Internal method to speak starting from a specific word index
     */
    speakFromWordIndex(startIndex, options = {}) {
      if (!synth || !state.text) return false;

      // Stop any existing utterance
      synth.cancel();
      stopKeepAlive();
      stopFallbackTimer();

      const wordsToSpeak = state.wordsList.slice(startIndex);
      const textChunk = wordsToSpeak.join(' ');
      if (!textChunk) {
        this.stop();
        return false;
      }

      const utterance = new SpeechSynthesisUtterance(textChunk);
      state.activeUtterance = utterance;

      const currentRate = options.rate || state.rate || 1.0;
      utterance.rate = currentRate;
      utterance.pitch = options.pitch || state.pitch || 1.0;
      utterance.volume = options.volume || state.volume || 1.0;

      if (state.selectedVoice) {
        utterance.voice = state.selectedVoice;
      }

      let hasReceivedBoundary = false;

      utterance.onstart = () => {
        state.isPlaying = true;
        state.isPaused = false;
        startKeepAlive();
        emit('start', { startIndex, totalWords: state.wordsList.length });

        // Highlight first word immediately
        state.currentWordIndex = startIndex;
        emit('boundary', {
          wordIndex: startIndex,
          word: state.wordsList[startIndex] || '',
          charIndex: 0
        });

        // Fallback timer: in case onboundary event is not supported by current browser voice engine
        // Average speech: ~150 words per minute at 1.0x rate = ~400ms per word
        const msPerWord = Math.max(180, Math.round(380 / currentRate));
        let fallbackWordPointer = startIndex;

        state.fallbackTimer = setInterval(() => {
          if (!hasReceivedBoundary && state.isPlaying && !state.isPaused) {
            fallbackWordPointer++;
            if (fallbackWordPointer < state.wordsList.length) {
              state.currentWordIndex = fallbackWordPointer;
              emit('boundary', {
                wordIndex: fallbackWordPointer,
                word: state.wordsList[fallbackWordPointer],
                charIndex: 0
              });
            }
          }
        }, msPerWord);
      };

      utterance.onboundary = (event) => {
        hasReceivedBoundary = true;
        stopFallbackTimer();

        if (event.name === 'word' || typeof event.charIndex === 'number') {
          // Find which word corresponds to charIndex in textChunk
          const charPos = event.charIndex;
          let localWordIndex = 0;
          let count = 0;

          for (let i = 0; i < wordsToSpeak.length; i++) {
            const wLen = wordsToSpeak[i].length;
            if (charPos >= count && charPos <= count + wLen + 1) {
              localWordIndex = i;
              break;
            }
            count += wLen + 1; // +1 for space
          }

          const globalWordIndex = startIndex + localWordIndex;
          state.currentWordIndex = globalWordIndex;

          emit('boundary', {
            wordIndex: globalWordIndex,
            word: state.wordsList[globalWordIndex] || '',
            charIndex: event.charIndex
          });
        }
      };

      utterance.onpause = () => {
        state.isPaused = true;
        emit('pause', { currentWordIndex: state.currentWordIndex });
      };

      utterance.onresume = () => {
        state.isPaused = false;
        emit('resume', { currentWordIndex: state.currentWordIndex });
      };

      utterance.onend = () => {
        stopKeepAlive();
        stopFallbackTimer();
        state.isPlaying = false;
        state.isPaused = false;
        state.currentWordIndex = -1;
        emit('end', { completed: true });
      };

      utterance.onerror = (event) => {
        stopKeepAlive();
        stopFallbackTimer();
        state.isPlaying = false;
        state.isPaused = false;
        // Ignore 'canceled' error when stopped explicitly
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          console.warn('[SpeechEngine] Utterance error:', event);
          emit('error', event);
        }
      };

      synth.speak(utterance);
      return true;
    },

    /**
     * Pause reading
     */
    pause() {
      if (synth && state.isPlaying && !state.isPaused) {
        synth.pause();
        state.isPaused = true;
        stopFallbackTimer();
        emit('pause', { currentWordIndex: state.currentWordIndex });
        return true;
      }
      return false;
    },

    /**
     * Resume reading from pause
     */
    resume() {
      if (synth && state.isPlaying && state.isPaused) {
        synth.resume();
        state.isPaused = false;
        emit('resume', { currentWordIndex: state.currentWordIndex });
        return true;
      }
      return false;
    },

    /**
     * Toggle Play / Pause
     */
    togglePlayPause(textOrWords) {
      if (!state.isPlaying) {
        return this.speakText(textOrWords);
      } else if (state.isPaused) {
        return this.resume();
      } else {
        return this.pause();
      }
    },

    /**
     * Stop and reset all speech synthesis
     */
    stop() {
      stopKeepAlive();
      stopFallbackTimer();
      if (synth) {
        synth.cancel();
      }
      state.isPlaying = false;
      state.isPaused = false;
      state.currentWordIndex = -1;
      emit('stop', {});
      return true;
    },

    /**
     * Speak a single word slowly for phonetics & Tap-to-Hinglish Visual Dictionary
     * @param {string} word 
     * @param {Object} options 
     */
    speakWord(word, options = {}) {
      if (!synth || !word) return false;

      // Temporarily pause main reader if active
      const wasPlaying = state.isPlaying && !state.isPaused;
      if (wasPlaying) {
        this.pause();
      }

      const clean = word.replace(/[^a-zA-Z0-9\s]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = options.rate || 0.75; // Slower rate for clear phonetics
      utterance.pitch = options.pitch || 1.0;

      if (state.selectedVoice) {
        utterance.voice = state.selectedVoice;
      }

      utterance.onend = () => {
        if (options.onEnd) options.onEnd();
      };

      synth.speak(utterance);
      return true;
    },

    /**
     * 2-Person Conversational Podcast Player (Signature Feature)
     * Alternates between Aarav (Curious Student, pitch: 0.92, rate: 1.0)
     * and Riya (Smart Mentor, pitch: 1.20, rate: 1.05)
     * with full Play, Pause, Resume, Stop, and Line-by-Line jump controls.
     */
    playPodcast(dialogueLines, options = {}) {
      if (!synth || !Array.isArray(dialogueLines) || dialogueLines.length === 0) {
        return false;
      }

      // Stop any other active speech
      this.stop();

      const podcastState = {
        lines: dialogueLines,
        currentIndex: typeof options.startIndex === 'number' ? options.startIndex : 0,
        isPlaying: true,
        isPaused: false,
        timer: null
      };
      state.podcast = podcastState;

      emit('podcastStart', {
        totalLines: dialogueLines.length,
        startIndex: podcastState.currentIndex
      });

      return this.speakPodcastLine(podcastState.currentIndex, options);
    },

    /**
     * Speak a specific line in the podcast dialogue
     */
    speakPodcastLine(lineIndex, options = {}) {
      if (!synth || !state.podcast || !state.podcast.lines) return false;

      const pState = state.podcast;
      if (lineIndex >= pState.lines.length) {
        pState.isPlaying = false;
        pState.isPaused = false;
        pState.currentIndex = -1;
        emit('podcastFinish', { completed: true });
        if (options.onFinish) options.onFinish();
        return true;
      }

      synth.cancel();
      stopKeepAlive();

      const line = pState.lines[lineIndex];
      pState.currentIndex = lineIndex;
      pState.isPlaying = true;
      pState.isPaused = false;

      const utterance = new SpeechSynthesisUtterance(line.text);
      pState.activeUtterance = utterance;

      // Assign distinct character voice pitches & rates
      const voices = synth.getVoices() || [];
      const maleVoice = voices.find(v => (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Ravi') || v.name.includes('George')) && v.lang.startsWith('en'));
      const femaleVoice = voices.find(v => (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Neerja') || v.name.includes('Samantha') || v.name.includes('Jenny')) && v.lang.startsWith('en'));

      if (line.speaker === 'Aarav') {
        utterance.pitch = 0.92;
        utterance.rate = 1.0;
        if (maleVoice) utterance.voice = maleVoice;
        else if (state.selectedVoice) utterance.voice = state.selectedVoice;
      } else {
        // Riya (Mentor)
        utterance.pitch = 1.20;
        utterance.rate = 1.05;
        if (femaleVoice) utterance.voice = femaleVoice;
        else if (state.selectedVoice) utterance.voice = state.selectedVoice;
      }

      utterance.onstart = () => {
        pState.isPlaying = true;
        pState.isPaused = false;
        startKeepAlive();
        emit('podcastLineStart', {
          index: lineIndex,
          line: line,
          speaker: line.speaker,
          avatar: line.avatar,
          totalLines: pState.lines.length
        });
        if (options.onLineStart) options.onLineStart(lineIndex, line);
      };

      utterance.onend = () => {
        stopKeepAlive();
        emit('podcastLineEnd', { index: lineIndex, line: line });

        if (pState.isPlaying && !pState.isPaused) {
          // Natural conversational pause between hosts
          pState.timer = setTimeout(() => {
            if (pState.isPlaying && !pState.isPaused) {
              this.speakPodcastLine(lineIndex + 1, options);
            }
          }, 450);
        }
      };

      utterance.onerror = (e) => {
        stopKeepAlive();
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('[SpeechEngine] Podcast line speech error:', e);
          if (pState.isPlaying && !pState.isPaused) {
            pState.timer = setTimeout(() => {
              this.speakPodcastLine(lineIndex + 1, options);
            }, 300);
          }
        }
      };

      synth.speak(utterance);
      return true;
    },

    pausePodcast() {
      if (synth && state.podcast && state.podcast.isPlaying && !state.podcast.isPaused) {
        if (state.podcast.timer) clearTimeout(state.podcast.timer);
        synth.pause();
        state.podcast.isPaused = true;
        emit('podcastPause', { currentIndex: state.podcast.currentIndex });
        return true;
      }
      return false;
    },

    resumePodcast() {
      if (synth && state.podcast && state.podcast.isPlaying && state.podcast.isPaused) {
        state.podcast.isPaused = false;
        synth.resume();
        emit('podcastResume', { currentIndex: state.podcast.currentIndex });
        return true;
      }
      return false;
    },

    stopPodcast() {
      if (state.podcast) {
        if (state.podcast.timer) clearTimeout(state.podcast.timer);
        state.podcast.isPlaying = false;
        state.podcast.isPaused = false;
        state.podcast.currentIndex = -1;
      }
      stopKeepAlive();
      if (synth) synth.cancel();
      emit('podcastStop', {});
      return true;
    },

    jumpToPodcastLine(index, options = {}) {
      if (!state.podcast || !state.podcast.lines) return false;
      const target = Math.max(0, Math.min(index, state.podcast.lines.length - 1));
      return this.speakPodcastLine(target, options);
    },

    getPodcastState() {
      if (!state.podcast) {
        return { isPlaying: false, isPaused: false, currentIndex: -1, totalLines: 0 };
      }
      return {
        isPlaying: state.podcast.isPlaying,
        isPaused: state.podcast.isPaused,
        currentIndex: state.podcast.currentIndex,
        totalLines: state.podcast.lines ? state.podcast.lines.length : 0
      };
    },

    // Legacy method forwarder
    speakDialogue(dialogueLines, onLineStart, onFinish) {
      return this.playPodcast(dialogueLines, { onLineStart, onFinish });
    },

    // -----------------------------------------------------------------
    // SPEECH RECOGNITION (Microphone Voice-to-Text)
    // -----------------------------------------------------------------
    startListening(options = {}) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        if (options.onError) options.onError('NOT_SUPPORTED');
        return null;
      }

      this.stopListening();

      try {
        const recognition = new SpeechRecognitionAPI();
        recognition.lang = options.lang || 'en-IN';
        recognition.continuous = options.continuous || false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          if (options.onStart) options.onStart();
        };

        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const piece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += piece;
            } else {
              interimTranscript += piece;
            }
          }

          if (options.onResult) {
            options.onResult({
              finalTranscript: finalTranscript.trim(),
              interimTranscript: interimTranscript.trim(),
              text: (finalTranscript || interimTranscript).trim()
            });
          }
        };

        recognition.onerror = (event) => {
          console.warn('[SpeechEngine] Recognition error:', event.error);
          if (options.onError) options.onError(event.error);
        };

        recognition.onend = () => {
          if (options.onEnd) options.onEnd();
        };

        recognition.start();
        state.activeRecognition = recognition;
        return recognition;
      } catch (err) {
        console.error('[SpeechEngine] Failed to start speech recognition:', err);
        if (options.onError) options.onError(err);
        return null;
      }
    },

    stopListening() {
      if (state.activeRecognition) {
        try {
          state.activeRecognition.stop();
        } catch (e) {
          // Ignore
        }
        state.activeRecognition = null;
      }
    }
  };

  window.SpeechEngine = SpeechEngine;
})(window);
